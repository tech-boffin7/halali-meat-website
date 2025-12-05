'use server';

import { prisma } from '@/lib/db';
import { contactSchema, quoteSchema } from '@/lib/definitions';
import { sendEmail } from '@/lib/email-service';
import { sendMessageNotification, sendQuoteNotification } from '@/lib/notification-service';
import { ratelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import { z } from 'zod';

/**
 * Public-facing server actions for website forms
 * These actions are used by non-authenticated users on the public website
 * All actions include rate limiting for security
 */

/**
 * Submit contact form from public website
 * Creates a new message in the database and sends notification to admin
 */
export async function submitContactForm(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  try {
    const parsedData = contactSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });

    const newMessage = await prisma.message.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        subject: parsedData.subject,
        body: parsedData.message,
      },
    });

    // Send notification to admin user (find first admin)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (adminUser) {
      await sendMessageNotification(adminUser.id, {
        id: newMessage.id,
        name: parsedData.name,
        email: parsedData.email,
        subject: parsedData.subject,
        body: parsedData.message,
      });
    }

    // Send confirmation email to customer
    await sendEmail({
      to: parsedData.email,
      subject: 'Message Received - Halali Meat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for contacting us!</h2>
          <p>Dear ${parsedData.name},</p>
          <p>We have received your message and will respond as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${parsedData.subject}</p>
            <p><strong>Your Message:</strong><br>${parsedData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>Best regards,<br>
          <strong>Halali Meat Team</strong></p>
        </div>
      `,
    });

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'Internal Server Error' };
  }
}

/**
 * Submit quote request form from public website
 * Creates a new quote in the database and sends notification to admin
 */
export async function submitQuoteForm(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for');
  const { success: rateLimitSuccess } = await ratelimit.limit(ip!);
  if (!rateLimitSuccess) {
    return { success: false, message: 'Too many requests. Please try again later.' };
  }

  try {
    const parsedData = quoteSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      productInterest: formData.get('productInterest'),
      quantity: formData.get('quantity'),
      message: formData.get('message'),
    });

    const newQuote = await prisma.quote.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone || 'N/A',
        company: parsedData.company || null,
        productInterest: parsedData.productInterest,
        quantity: parsedData.quantity,
        message: parsedData.message || 'N/A',
      },
    });

    // Send notification to admin user (find first admin)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true },
    });

    if (adminUser) {
      await sendQuoteNotification(adminUser.id, {
        id: newQuote.id,
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone || 'N/A',
        company: parsedData.company || null,
        productInterest: parsedData.productInterest,
        message: parsedData.message || 'N/A',
      });
    }

    // Send confirmation email to customer
    await sendEmail({
      to: parsedData.email,
      subject: 'Quote Request Received - Halali Meat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for your quote request!</h2>
          <p>Dear ${parsedData.name},</p>
          <p>We have successfully received your quote request. Our team will review your requirements and respond within 24-48 hours.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Your Request Details:</h3>
            <p><strong>Product of Interest:</strong> ${parsedData.productInterest}</p>
            <p><strong>Quantity:</strong> ${parsedData.quantity}</p>
            ${parsedData.company ? `<p><strong>Company:</strong> ${parsedData.company}</p>` : ''}
            ${parsedData.message && parsedData.message !== 'N/A' ? `<p><strong>Additional Requirements:</strong><br>${parsedData.message.replace(/\n/g, '<br>')}</p>` : ''}
          </div>
          
          <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          <strong>Halali Meat Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    return { success: true, message: 'Quote request sent successfully!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    console.error('Error submitting quote form:', error);
    return { success: false, message: 'Internal Server Error' };
  }
}

