import { getUserSettings } from './data-access';
import { sendEmail } from './email-service';
import { logger } from './logger';

/**
 * CRITICAL: Notification Service Layer
 * All notification functions MUST check user settings before sending
 */

/**
 * Send quote notification email (if enabled in settings)
 * @returns success: true if sent, false if disabled
 */
export async function sendQuoteNotification(
  userId: string,
  quote: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string | null;
    productInterest?: string | null;
    message: string;
  }
) {
  // CRITICAL: Check settings FIRST
  const settings = await getUserSettings(userId);
  
  if (!settings?.emailNotifications || !settings?.quoteNotifications) {
    logger.info('Quote notification skipped', { userId, reason: 'disabled in settings' });
    return { success: false, reason: 'notifications_disabled' };
  }

  // Only send if notifications are enabled
  try {
    await sendEmail({
      to: 'admin@halali.co.ke', // Replace with actual admin email from settings
      subject: `New Quote Request from ${quote.name}`,
      html: `
<h2>New Quote Request</h2>
<p><strong>From:</strong> ${quote.name}</p>
<p><strong>Email:</strong> ${quote.email}</p>
<p><strong>Phone:</strong> ${quote.phone}</p>
${quote.company ? `<p><strong>Company:</strong> ${quote.company}</p>` : ''}
${quote.productInterest ? `<p><strong>Product Interest:</strong> ${quote.productInterest}</p>` : ''}
<p><strong>Message:</strong></p>
<p>${quote.message.replace(/\n/g, '<br>')}</p>
<p><a href="${process.env.NEXTAUTH_URL}/admin/quotes">View in Admin Panel</a></p>
      `,
    });

    logger.info('Quote notification sent', { userId, quoteId: quote.id });
    return { success: true, reason: 'sent' };
  } catch (error) {
    logger.error('Error sending quote notification:', { error });
    return { success: false, reason: 'send_failed' };
  }
}

/**
 * Send message notification email (if enabled in settings)
 */
export async function sendMessageNotification(
  userId: string,
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    body: string;
  }
) {
  // CRITICAL: Check settings FIRST
  const settings = await getUserSettings(userId);
  
  if (!settings?.emailNotifications || !settings?.messageNotifications) {
    logger.info('Message notification skipped', { userId, reason: 'disabled in settings' });
    return { success: false, reason: 'notifications_disabled' };
  }

  try {
    await sendEmail({
      to: 'admin@halali.co.ke',
      subject: `New Message: ${message.subject}`,
      html: `
<h2>New Message</h2>
<p><strong>From:</strong> ${message.name} (${message.email})</p>
<p><strong>Subject:</strong> ${message.subject}</p>
<hr>
<p>${message.body.replace(/\n/g, '<br>')}</p>
<p><a href="${process.env.NEXTAUTH_URL}/admin/messages">View in Admin Panel</a></p>
      `,
    });

    logger.info('Message notification sent', { userId, messageId: message.id });
    return { success: true, reason: 'sent' };
  } catch (error) {
    logger.error('Error sending message notification:', { error });
    return { success: false, reason: 'send_failed' };
  }
}

/**
 * Send product low stock notification (if enabled in settings)
 */
export async function sendProductNotification(
  userId: string,
  product: {
    id: string;
    name: string;
    category: string;
    // Add stock field when implemented
  }
) {
  // CRITICAL: Check settings FIRST
  const settings = await getUserSettings(userId);
  
  if (!settings?.emailNotifications || !settings?.productNotifications) {
    logger.info('Product notification skipped', { userId, reason: 'disabled in settings' });
    return { success: false, reason: 'notifications_disabled' };
  }

  try {
    await sendEmail({
      to: 'admin@halali.co.ke',
      subject: `Product Alert: ${product.name}`,
      html: `<h2>Product Alert</h2><p>${product.name} requires attention.</p>`,
    });

    logger.info('Product notification sent', { userId, productId: product.id });
    return { success: true, reason: 'sent' };
  } catch (error) {
    logger.error('Error sending product notification:', { error });
    return { success: false, reason: 'send_failed' };
  }
}
