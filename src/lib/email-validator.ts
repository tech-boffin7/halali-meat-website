import nodemailer from 'nodemailer';

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

/**
 * Test SMTP connection with given configuration
 * @param config - SMTP configuration to test
 * @returns Promise<boolean> - true if connection successful
 */
export async function testSMTPConnection(config: SMTPConfig): Promise<{ success: boolean; message: string }> {
  try {
    // Create transporter with provided config
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? (config.port === 465), // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates in dev
      },
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.user, // Send to self
      subject: 'SMTP Configuration Test - Halali Meat',
      text: 'This is a test email to verify your SMTP configuration.\n\nIf you received this email, your SMTP settings are working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #4CAF50;">✅ SMTP Configuration Test</h2>
          <p>This is a test email to verify your SMTP configuration.</p>
          <p style="padding: 15px; background-color: #f0f0f0; border-left: 4px solid #4CAF50;">
            <strong>Success!</strong> If you received this email, your SMTP settings are working correctly.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Sent from Halali Meat Admin Panel<br>
            Test performed at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return {
      success: true,
      message: 'SMTP connection successful! Test email sent.',
    };
  } catch (error: any) {
    console.error('SMTP connection test failed:', error);
    
    let message = 'SMTP connection failed: ';
    if (error.code === 'EAUTH') {
      message += 'Authentication failed. Check your username and password.';
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      message += 'Cannot connect to SMTP server. Check host and port.';
    } else if (error.code === 'ESOCKET') {
      message += 'Network error. Check your internet connection.';
    } else {
      message += error.message || 'Unknown error';
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Validate SMTP configuration format
 * @param config - Configuration to validate
 * @returns Validation result
 */
export function validateSMTPConfig(config: Partial<SMTPConfig>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.host) errors.push('SMTP host is required');
  if (!config.port || config.port < 1 || config.port > 65535) errors.push('Valid SMTP port is required (1-65535)');
  if (!config.user) errors.push('SMTP user is required');
  if (!config.password) errors.push('SMTP password is required');
  if (!config.fromEmail) errors.push('From email is required');
  if (!config.fromName) errors.push('From name is required');

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.fromEmail && !emailRegex.test(config.fromEmail)) {
    errors.push('Invalid from email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
