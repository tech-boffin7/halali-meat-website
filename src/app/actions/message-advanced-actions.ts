'use server';

// Advanced Messages Features - Server Actions
// This file contains server actions for:
// 1. File Attachments
// 2. Email Threading  
// 3. Message Scheduling

import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { mailOptions, transporter } from '@/lib/nodemailer';
import { ratelimit } from '@/lib/ratelimit';
import { MessageStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

// ==================== FILE ATTACHMENTS ====================

export async function sendMessageWithAttachments(
  messageData: {
    to: string;
    subject: string;
    body: string;
    parentMessageId?: string;
  },
  attachments: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>
) {
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
    if (messageData.parentMessageId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: messageData.parentMessageId },
        select: { threadId: true, id: true }
      });
      threadId = parentMessage?.threadId || parentMessage?.id || null;
    }

    // Send email with attachments
    await transporter.sendMail({
      ...mailOptions,
      to: messageData.to,
      subject: messageData.subject,
      html: messageData.body,
      attachments: attachments.map(att => ({
        filename: att.filename,
        path: att.fileUrl
      }))
    });

    // Create message record with attachments
    const message = await prisma.message.create({
      data: {
        name: session.user.name || 'Admin',
        email: messageData.to,
        subject: messageData.subject,
        body: messageData.body,
        type: 'OUTBOUND',
        status: 'READ',
        userId: session.user.id,
        threadId: threadId,
        parentMessageId: messageData.parentMessageId || null,
        sentAt: new Date(),
        attachments: {
          create: attachments.map(att => ({
            filename: att.filename,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            mimeType: att.mimeType
          }))
        }
      },
      include: {
        attachments: true
      }
    });

    return { success: true, message: 'Message sent successfully!', data: message };
  } catch (error) {
    console.error('Error sending message with attachments:', error);
    return { success: false, message: 'Failed to send message' };
  }
}

export async function deleteAttachment(attachmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.attachment.delete({
      where: { id: attachmentId }
    });

    return { success: true, message: 'Attachment deleted successfully' };
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return { success: false, message: 'Failed to delete attachment' };
  }
}

// ==================== EMAIL THREADING ====================

export async function getThreadMessages(threadId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      include: {
        attachments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return { success: true, messages };
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return { success: false, message: 'Failed to fetch thread messages', messages: [] };
  }
}

export async function getMessageThreads(page = 1, limit = 10, search?: string) {
  try {
    // Get unique threads (group by threadId, get first message of each)
    const threads = await prisma.message.groupBy({
      by: ['threadId'],
      where: {
        threadId: { not: null },
        type: 'INBOUND',
        status: { notIn: ['ARCHIVED', 'TRASH'] },
        OR: search ? [
          { subject: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ] : undefined
      },
      _count: true,
      _max: { createdAt: true }
    });

    // Get details for each thread
    const threadsWithDetails = await Promise.all(
      threads.slice((page - 1) * limit, page * limit).map(async (thread) => {
        const firstMessage = await prisma.message.findFirst({
          where: { threadId: thread.threadId! },
          orderBy: { createdAt: 'asc' },
          include: { attachments: true }
        });

        const latestMessage = await prisma.message.findFirst({
          where: { threadId: thread.threadId! },
          orderBy: { createdAt: 'desc' }
        });

        return {
          threadId: thread.threadId,
          count: thread._count,
          firstMessage,
          latestMessage,
          latestTimestamp: thread._max.createdAt
        };
      })
    );

    return {
      success: true,
      threads: threadsWithDetails,
      totalCount: threads.length
    };
  } catch (error) {
    console.error('Error fetching message threads:', error);
    return { success: false, message: 'Failed to fetch threads', threads: [], totalCount: 0 };
  }
}

// ==================== MESSAGE SCHEDULING ====================

export async function scheduleMessage(
  messageData: {
    to: string;
    subject: string;
    body: string;
  },
  scheduledFor: Date,
  attachments?: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>
) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  // Validate scheduledFor is in future
  const now = new Date();
  if (new Date(scheduledFor) <= now) {
    return { success: false, message: 'Scheduled time must be in the future' };
  }

  try {
    const message = await prisma.message.create({
      data: {
        name: session.user.name || 'Admin',
        email: messageData.to,
        subject: messageData.subject,
        body: messageData.body,
        type: 'OUTBOUND',
        status: MessageStatus.SCHEDULED,
        userId: session.user.id,
        scheduledFor: new Date(scheduledFor),
        sentAt: null,
        attachments: attachments ? {
          create: attachments.map(att => ({
            filename: att.filename,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            mimeType: att.mimeType
          }))
        } : undefined
      },
      include: {
        attachments: true
      }
    });

    return { success: true, message: 'Message scheduled successfully!', data: message };
  } catch (error) {
    console.error('Error scheduling message:', error);
    return { success: false, message: 'Failed to schedule message' };
  }
}

export async function getScheduledMessages() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized', messages: [] };
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        status: MessageStatus.SCHEDULED,
        userId: session.user.id
      },
      orderBy: { scheduledFor: 'asc' },
      include: {
        attachments: true
      }
    });

    return { success: true, messages };
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    return { success: false, message: 'Failed to fetch scheduled messages', messages: [] };
  }
}

export async function cancelScheduledMessage(messageId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // Verify ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { userId: true, status: true }
    });

    if (!message || message.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized or message not found' };
    }

    if (message.status !== MessageStatus.SCHEDULED) {
      return { success: false, message: 'Message is not scheduled' };
    }

    // Delete the scheduled message
    await prisma.message.delete({
      where: { id: messageId }
    });

    return { success: true, message: 'Scheduled message cancelled' };
  } catch (error) {
    console.error('Error cancelling scheduled message:', error);
    return { success: false, message: 'Failed to cancel scheduled message' };
  }
}

export async function sendScheduledMessageNow(messageId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { attachments: true }
    });

    if (!message || message.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized or message not found' };
    }

    if (message.status !== MessageStatus.SCHEDULED) {
      return { success: false, message: 'Message is not scheduled' };
    }

    // Send email
    await transporter.sendMail({
      ...mailOptions,
      to: message.email,
      subject: message.subject,
      html: message.body,
      attachments: message.attachments.map(att => ({
        filename: att.filename,
        path: att.fileUrl
      }))
    });

    // Update status
    await prisma.message.update({
      where: { id: messageId },
      data: {
        status: MessageStatus.SENT,
        sentAt: new Date()
      }
    });

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending scheduled message:', error);
    return { success: false, message: 'Failed to send message' };
  }
}
