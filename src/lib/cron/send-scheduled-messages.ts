// Cron Job: Send Scheduled Messages
// This script should be called every 5 minutes by Vercel Cron or similar

import { MessageStatus } from '@prisma/client';
import { prisma } from '../db';
import { logger } from '../logger';
import { mailOptions, transporter } from '../nodemailer';

export async function sendScheduledMessages() {
  const now = new Date();
  
  try {
    // Find messages scheduled for now or past
    const scheduledMessages = await prisma.message.findMany({
      where: {
        status: MessageStatus.SCHEDULED,
        scheduledFor: { lte: now }
      },
      include: { attachments: true },
      take: 50 // Process max 50 at a time
    });

    logger.info('Processing scheduled messages', { count: scheduledMessages.length });

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const message of scheduledMessages) {
      try {
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

        // Update status to SENT
        await prisma.message.update({
          where: { id: message.id },
          data: {
            status: MessageStatus.SENT,
            sentAt: new Date()
          }
        });

        results.sent++;
        logger.info('Scheduled message sent', { messageId: message.id });

      } catch (error: any) {
        results.failed++;
        const errorMsg = `Failed to send message ${message.id}: ${error.message}`;
        results.errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);

        // Optionally: Mark as failed or retry later
        // For now, we'll leave it as SCHEDULED to retry next time
      }
    }

    logger.info('Batch complete', { sent: results.sent, failed: results.failed });
    return results;

  } catch (error) {
    console.error('Error in sendScheduledMessages:', error);
    throw error;
  }
}

//