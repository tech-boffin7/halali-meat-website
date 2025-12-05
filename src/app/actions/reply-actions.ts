
'use server';

import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth";

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Forbidden: You do not have administrative privileges.");
  }
  return session.user.id;
}

export async function createReply(quoteId: string, content: string) {
  try {
    const userId = await checkAdminAuth();

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      throw new Error('Quote not found');
    }

    const newReply = await prisma.reply.create({
      data: {
        content,
        quoteId,
        userId,
      },
    });

    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'RESPONDED' },
    });

    // Note: Email sending is handled in quote-actions.ts via replyToQuote()
    // This function just creates the reply record

    return { success: true, reply: newReply };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create reply' };
  }
}
