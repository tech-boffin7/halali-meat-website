'use server';

import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { ActionResponse, composeMessageSchema, MessageCounts } from '@/lib/definitions';
import { handleServerActionError } from '@/lib/error-handler';
import { mailOptions, transporter } from '@/lib/nodemailer';
import { ratelimit } from '@/lib/ratelimit';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { z } from 'zod';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { getContactMessages, getSentMessages } from '@/lib/data-access';

export async function getMessageBadgeCounts(): Promise<{ success: boolean; counts?: MessageCounts; error?: string }> {
  try {
    const [
      totalInbound,
      unread,
      read,
      archived,
      trash,
      drafts
    ] = await Promise.all([
      prisma.message.count({ where: { type: 'INBOUND', status: { notIn: ['ARCHIVED', 'TRASH'] } } }),
      prisma.message.count({ where: { type: 'INBOUND', status: 'UNREAD' } }),
      prisma.message.count({ where: { type: 'INBOUND', status: 'READ' } }),
      prisma.message.count({ where: { status: 'ARCHIVED' } }),
      prisma.message.count({ where: { status: 'TRASH' } }),
      prisma.message.count({ where: { type: 'OUTBOUND', isDraft: true } }),
    ]);

    return {
      success: true,
      counts: {
        total: totalInbound + drafts + archived + trash,
        totalInbound,
        unread,
        read,
        archived,
        trash,
        drafts,
      },
    };
  } catch (error: any) {
    console.error("Error in getMessageBadgeCounts:", error);
    return { success: false, error: error.message || 'Failed to fetch message counts.' };
  }
}

export async function getMessagesAction(page = 1, limit = 10, status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
  try {
    const { messages, totalCount } = await getContactMessages(page, limit, status, sortBy, search, dateFrom, dateTo);
    const countsResult = await getMessageBadgeCounts();
    if (!countsResult.success) {
      return { success: false, messages: [], totalCount: 0, message: countsResult.error };
    }
    return { success: true, messages, totalCount, counts: countsResult.counts };
  } catch (error: any) {
    console.error("Error in getMessagesAction:", error);
    return { success: false, messages: [], totalCount: 0, message: error.message || 'Failed to fetch inbound messages.' };
  }
}

export async function getSentMessagesAction(page = 1, limit = 10, sortBy?: string, search?: string, status?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, messages: [], totalCount: 0, message: 'Unauthorized: User not logged in.' };
  }
  try {
    const { messages, totalCount } = await getSentMessages(session.user.id, page, limit, sortBy, search, status, dateFrom, dateTo);
    const countsResult = await getMessageBadgeCounts();
    if (!countsResult.success) {
      return { success: false, messages: [], totalCount: 0, message: countsResult.error };
    }
    return { success: true, messages, totalCount, counts: countsResult.counts };
  } catch (error: any) {
    console.error("Error in getSentMessagesAction:", error);
    return { success: false, messages: [], totalCount: 0, message: error.message || 'Failed to fetch sent messages.' };
  }
}

export async function sendComposedMessage(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const parsedData = composeMessageSchema.parse({
      to: formData.get('to'),
      subject: formData.get('subject'),
      body: formData.get('body'),
    });

    // Admin composed messages are intentional sends, no need for notification check
    await transporter.sendMail({
      ...mailOptions,
      to: parsedData.to,
      subject: parsedData.subject,
      html: parsedData.body,
    });

    await prisma.message.create({
      data: {
        name: session.user.name || 'Admin',
        email: parsedData.to,
        subject: parsedData.subject,
        body: parsedData.body,
        type: 'OUTBOUND',
        status: 'READ',
        userId: session.user.id,
      }
    });

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    console.error('Error sending composed message:', error);
    return handleServerActionError(error, 'Failed to send message.');
  }
}

export async function replyToMessage(recipientEmail: string, subject: string, content: string, parentMessageId?: string) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // Determine threading
    let threadId = null;
    if (parentMessageId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: parentMessageId },
        select: { threadId: true, id: true }
      });
      threadId = parentMessage?.threadId || parentMessage?.id || null;
    }

    await transporter.sendMail({
      ...mailOptions,
      to: recipientEmail,
      subject: `Re: ${subject}`,
      html: content,
    });

    await prisma.message.create({
      data: {
        name: session.user.name || 'Admin',
        email: recipientEmail,
        subject: `Re: ${subject}`,
        body: content,
        type: 'OUTBOUND',
        status: 'READ',
        userId: session.user.id,
        threadId: threadId,
        parentMessageId: parentMessageId || null,
      }
    });

    return { success: true, message: 'Reply sent successfully!' };
  } catch (error) {
    console.error('Error sending reply:', error);
    return handleServerActionError(error, 'Failed to send reply');
  }
}

export async function forwardMessage(recipientEmail: string, subject: string, content: string, parentMessageId?: string) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // Determine threading - usually forwards start new threads, but if we want to track origin
    // For now, let's keep forwards as new threads or linked if desired. 
    // If we want to link it to the original thread:
    if (parentMessageId) {
      // For forwarding, we might want to keep it separate or link it. 
      // Usually forwarding starts a new conversation context, so we might NOT want to link threadId 
      // unless it's strictly desired. 
      // However, tracking parentMessageId is good for analytics.
    }

    await transporter.sendMail({
      ...mailOptions,
      to: recipientEmail,
      subject: `Fwd: ${subject}`,
      html: content,
    });

    await prisma.message.create({
      data: {
        name: session.user.name || 'Admin',
        email: recipientEmail,
        subject: `Fwd: ${subject}`,
        body: content,
        type: 'OUTBOUND',
        status: 'READ',
        userId: session.user.id,
        parentMessageId: parentMessageId || null, // Track origin but maybe not thread
      }
    });

    return { success: true, message: 'Forward sent successfully!' };
  } catch (error) {
    console.error('Error sending forward:', error);
    return handleServerActionError(error, 'Failed to send forward');
  }
}

export async function updateMessageStatus(id: string, status: 'READ' | 'UNREAD' | 'ARCHIVED' | 'TRASH') {
  try {
    const message = await prisma.message.update({
      where: { id },
      data: { status },
    });
    return { success: true, message };
  } catch (error) {
    console.error('Failed to update message status:', error);
    return handleServerActionError(error, 'Failed to update message status');
  }
}

export async function updateMultipleMessageStatus(ids: string[], status: 'READ' | 'UNREAD' | 'ARCHIVED' | 'TRASH') {
  try {
    await prisma.message.updateMany({
      where: {
        id: { in: ids },
      },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update message statuses');
  }
}


export async function deleteMessage(id: string) {
  return updateMessageStatus(id, 'TRASH');
}

export async function permanentlyDeleteMessage(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // 1. Fetch message with attachments
    const message = await prisma.message.findUnique({
      where: { id },
      include: { attachments: true }
    });

    if (!message) {
      return { success: false, message: 'Message not found' };
    }

    // 2. Delete attachments from Cloudinary
    if (message.attachments && message.attachments.length > 0) {
      const deletePromises = message.attachments.map(att => {
        // Extract public_id from URL
        // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<public_id>.<ext>
        // We need <folder>/<public_id>
        try {
          const urlParts = att.fileUrl.split('/');
          const filenameWithExt = urlParts[urlParts.length - 1];
          const folder = urlParts[urlParts.length - 2];
          const filename = filenameWithExt.split('.')[0];
          const publicId = `${folder}/${filename}`;

          // Determine resource type based on mime type
          const resourceType = att.mimeType.startsWith('image/') ? 'image' : 'raw';

          return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (e) {
          console.error(`Failed to parse public_id for attachment ${att.id}`, e);
          return Promise.resolve();
        }
      });

      await Promise.all(deletePromises);
    }

    // 3. Delete message from DB (cascades to attachments)
    await prisma.message.delete({ where: { id } });
    return { success: true, message: 'Message permanently deleted' };
  } catch (error) {
    console.error('Error permanently deleting message:', error);
    return handleServerActionError(error, 'Failed to permanently delete message');
  }
}

export async function emptyTrash() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // 1. Fetch all trash messages with attachments
    const trashMessages = await prisma.message.findMany({
      where: { status: 'TRASH' },
      include: { attachments: true }
    });

    // 2. Delete all attachments from Cloudinary
    const deletePromises: Promise<any>[] = [];

    for (const message of trashMessages) {
      if (message.attachments && message.attachments.length > 0) {
        for (const att of message.attachments) {
          try {
            const urlParts = att.fileUrl.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1];
            const folder = urlParts[urlParts.length - 2];
            const filename = filenameWithExt.split('.')[0];
            const publicId = `${folder}/${filename}`;

            const resourceType = att.mimeType.startsWith('image/') ? 'image' : 'raw';

            deletePromises.push(cloudinary.uploader.destroy(publicId, { resource_type: resourceType }));
          } catch (e) {
            console.error(`Failed to parse public_id for attachment ${att.id}`, e);
          }
        }
      }
    }

    await Promise.all(deletePromises);

    // 3. Delete all trash messages
    await prisma.message.deleteMany({ where: { status: 'TRASH' } });
    return { success: true, message: 'Trash emptied' };
  } catch (error) {
    console.error('Error emptying trash:', error);
    return handleServerActionError(error, 'Failed to empty trash');
  }
}

export async function getAllMessagesForExport(status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
  try {
    // Pass limit 0 to fetch all
    const { messages, totalCount } = await getContactMessages(1, 0, status, sortBy, search, dateFrom, dateTo);
    return { success: true, messages, totalCount };
  } catch (error: any) {
    console.error("Error in getAllMessagesForExport:", error);
    return { success: false, messages: [], totalCount: 0, message: error.message || 'Failed to fetch messages for export.' };
  }
}

export async function getAllSentMessagesForExport(sortBy?: string, search?: string, status?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, messages: [], totalCount: 0, message: 'Unauthorized: User not logged in.' };
  }
  try {
    // Pass limit 0 to fetch all
    const { messages, totalCount } = await getSentMessages(session.user.id, 1, 0, sortBy, search, status, dateFrom, dateTo);
    return { success: true, messages, totalCount };
  } catch (error: any) {
    console.error("Error in getAllSentMessagesForExport:", error);
    return { success: false, messages: [], totalCount: 0, message: error.message || 'Failed to fetch sent messages for export.' };
  }
}