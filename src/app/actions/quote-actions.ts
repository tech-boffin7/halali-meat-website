'use server';

import { authOptions } from "@/lib/authOptions";
import { getQuotes } from '@/lib/data-access';
import { prisma } from '@/lib/db';
import { ActionResponse, QuoteCounts } from '@/lib/definitions';
import { sendEmail } from '@/lib/email-service';
import { handleServerActionError } from '@/lib/error-handler';
import { QuoteStatus } from '@prisma/client';
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache';

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Forbidden: You do not have administrative privileges.");
  }
  return session.user.id;
}

export async function getQuoteBadgeCounts(): Promise<{ success: boolean; counts?: QuoteCounts; error?: string }> {
  try {
    const [
      total,
      unread,
      read,
      pending,
      processed,
      responded,
      archived,
      trash
    ] = await Promise.all([
      prisma.quote.count({ where: { status: { notIn: [QuoteStatus.ARCHIVED, QuoteStatus.TRASH] } } }),
      prisma.quote.count({ where: { status: QuoteStatus.UNREAD } }),
      prisma.quote.count({ where: { status: QuoteStatus.READ } }),
      prisma.quote.count({ where: { status: QuoteStatus.PENDING } }),
      prisma.quote.count({ where: { status: QuoteStatus.PROCESSED } }),
      prisma.quote.count({ where: { status: QuoteStatus.RESPONDED } }),
      prisma.quote.count({ where: { status: QuoteStatus.ARCHIVED } }),
      prisma.quote.count({ where: { status: QuoteStatus.TRASH } }),
    ]);

    return {
      success: true,
      counts: {
        total,
        unread,
        read,
        pending,
        processed,
        responded,
        archived,
        trash,
      },
    };
  } catch (error) {
    return handleServerActionError(error, 'Failed to fetch quote badge counts');
  }
}

export async function getQuotesAction(page = 1, limit = 10, status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
    try {
        await checkAdminAuth();
        const { quotes, totalCount } = await getQuotes(page, limit, status, sortBy, search, dateFrom, dateTo);
        const countsResult = await getQuoteBadgeCounts();
        if (!countsResult.success) {
          return { success: false, quotes: [], totalCount: 0, message: countsResult.error };
        }
        return { success: true, quotes: quotes as any, totalCount, counts: countsResult.counts };
    } catch (error) {
        return handleServerActionError(error, 'Failed to fetch quotes');
    }
}

export async function getAllQuotesForExport(status?: string, sortBy?: string, search?: string, dateFrom?: Date, dateTo?: Date): Promise<ActionResponse> {
    try {
        await checkAdminAuth();
        // Pass limit 0 to fetch all
        const { quotes, totalCount } = await getQuotes(1, 0, status, sortBy, search, dateFrom, dateTo);
        return { success: true, quotes: quotes as any, totalCount };
    } catch (error) {
        return handleServerActionError(error, 'Failed to fetch quotes for export');
    }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
    try {
        await checkAdminAuth();
        const quote = await prisma.quote.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/admin/quotes');
        const countsResult = await getQuoteBadgeCounts();
        return { success: true, quote, counts: countsResult.counts };
    } catch (error) {
        return handleServerActionError(error, 'Failed to update quote status');
    }
}

export async function updateMultipleQuoteStatus(ids: string[], status: QuoteStatus) {
    try {
        await checkAdminAuth();
        await prisma.quote.updateMany({
            where: {
                id: { in: ids },
            },
            data: { status },
        });
        revalidatePath('/admin/quotes');
        const countsResult = await getQuoteBadgeCounts();
        return { success: true, counts: countsResult.counts };
    } catch (error) {
        return handleServerActionError(error, 'Failed to update quote statuses');
    }
}

export async function replyToQuote(quoteId: string, recipientEmail: string, content: string) {
    try {
        const userId = await checkAdminAuth();

        const emailResult = await sendEmail({
            to: recipientEmail,
            subject: `Re: Your Quote Request`,
            html: content,
        });

        if (!emailResult.success) {
            throw new Error('Failed to send email');
        }

        await prisma.$transaction(async (tx) => {
            await tx.reply.create({
                data: {
                    content,
                    quoteId,
                    userId,
                },
            });

            await tx.quote.update({
                where: { id: quoteId },
                data: { status: 'RESPONDED' },
            });
        });

        return { success: true, message: 'Reply sent successfully!' };
    } catch (error) {
        return handleServerActionError(error, 'Failed to send reply');
    }
}

export async function permanentlyDeleteQuote(id: string) {
    try {
        await checkAdminAuth();
        await prisma.quote.delete({ where: { id } });
        return { success: true, message: 'Quote permanently deleted' };
    } catch (error) {
        return handleServerActionError(error, 'Failed to permanently delete quote');
    }
}

export async function emptyTrash() {
    try {
        await checkAdminAuth();
        await prisma.quote.deleteMany({ where: { status: 'TRASH' } });
        return { success: true, message: 'Trash emptied' };
    } catch (error) {
        return handleServerActionError(error, 'Failed to empty trash');
    }
}