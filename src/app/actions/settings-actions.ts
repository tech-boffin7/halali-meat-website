'use server';

import { authOptions } from '@/lib/authOptions';
import { getCloudinaryEnvConfig } from '@/lib/cloudinary-config';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { handleServerActionError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { rateLimiter } from '@/lib/rate-limiter';
import {
    changePasswordSchema,
    companySettingsSchema,
    emailSettingsSchema,
    integrationSettingsSchema,
    notificationPreferencesSchema,
    preferenceSettingsSchema,
    profileSettingsSchema,
    securitySettingsSchema,
    type ChangePasswordData,
    type CompanySettingsData,
    type EmailSettingsData,
    type IntegrationSettingsData,
    type NotificationPreferencesData,
    type PreferenceSettingsData,
    type ProfileSettingsData,
    type SecuritySettingsData
} from '@/lib/schemas/settings-schemas';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

// Helper function to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    logger.warn('Unauthorized settings access attempt', { userId: session?.user?.id });
    throw new Error('Forbidden: You do not have administrative privileges.');
  }
  return session.user.id as string;
}

/**
 * Get current user's settings
 */
export async function getSettings() {
  try {
    const userId = await checkAdminAuth();

    let settings = await prisma.settings.findUnique({
      where: { userId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId },
      });
    }

    // SECURITY: Never send actual password to client
    // Mask password to indicate it exists without exposing value
    if (settings.smtpPassword) {
      settings.smtpPassword = '••••••••';
    }

    // Merge with environment variables (env as fallback)
    const envConfig = getCloudinaryEnvConfig();
    const mergedSettings = {
      ...settings,
      // Use database values if they exist, otherwise fall back to env
      cloudinaryCloudName: settings.cloudinaryCloudName || envConfig.cloudName,
      cloudinaryApiKey: settings.cloudinaryApiKey || envConfig.apiKey,
      // Never expose the secret (API secret should never be read)
      cloudinaryApiSecret: settings.cloudinaryApiSecret ? '***ENCRYPTED***' : null,
    };

    return { success: true, settings: mergedSettings };
  } catch (error) {
    return handleServerActionError(error, 'Failed to fetch settings');
  }
}

/**
 * Update company settings
 */
export async function updateCompanySettings(data: CompanySettingsData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = companySettingsSchema.parse(data);

    await prisma.settings.update({
      where: { userId },
      data: {
        companyName: validatedData.companyName,
        companyEmail: validatedData.companyEmail,
        companyPhone: validatedData.companyPhone,
        companyAddress: validatedData.companyAddress,
        companyWebsite: validatedData.companyWebsite,
        companyLogoUrl: validatedData.companyLogoUrl,
        companyLogoDarkUrl: validatedData.companyLogoDarkUrl,
        faviconUrl: validatedData.faviconUrl,
      },
    });

    logger.info('Company settings updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Company settings updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update company settings');
  }
}

/**
 * Update email settings
 */
export async function updateEmailSettings(data: EmailSettingsData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = emailSettingsSchema.parse(data);
    
    const updateData: any = {
      smtpHost: validatedData.smtpHost,
      smtpPort: validatedData.smtpPort,
      smtpUser: validatedData.smtpUser,
      smtpFromEmail: validatedData.smtpFromEmail,
      smtpFromName: validatedData.smtpFromName,
      emailSignature: validatedData.emailSignature,
    };

    // Only update password if provided
    if (validatedData.smtpPassword) {
      updateData.smtpPassword = encrypt(validatedData.smtpPassword);
    }

    await prisma.settings.update({
      where: { userId },
      data: updateData,
    });

    logger.info('Email settings updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Email settings updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update email settings');
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(data: NotificationPreferencesData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = notificationPreferencesSchema.parse(data);

    await prisma.settings.update({
      where: { userId },
      data: {
        emailNotifications: validatedData.emailNotifications,
        quoteNotifications: validatedData.quoteNotifications,
        messageNotifications: validatedData.messageNotifications,
        productNotifications: validatedData.productNotifications,
      },
    });

    logger.info('Notification preferences updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Notification preferences updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update notification preferences');
  }
}

/**
 * Update security settings
 */
export async function updateSecuritySettings(data: SecuritySettingsData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = securitySettingsSchema.parse(data);

    await prisma.settings.update({
      where: { userId },
      data: {
        twoFactorEnabled: validatedData.twoFactorEnabled,
        sessionTimeout: validatedData.sessionTimeout,
      },
    });

    logger.info('Security settings updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Security settings updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update security settings');
  }
}

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordData) {
  try {
    const userId = await checkAdminAuth();

    // Rate limiting check
    const rateCheck = rateLimiter.check(userId, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      logger.warn('Password change rate limit exceeded', { userId });
      const minutesRemaining = Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 60000);
      return { 
        success: false, 
        message: `Too many attempts. Try again in ${minutesRemaining} minutes.` 
      };
    }
    
    const validatedData = changePasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(validatedData.currentPassword, user.password);

    if (!isValid) {
      logger.warn('Failed password change attempt (invalid current password)', { userId });
      return { success: false, message: 'Incorrect current password' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        lastPasswordChange: new Date(),
      },
    });

    logger.info('Password changed successfully', { userId });
    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to change password');
  }
}

/**
 * Update application preferences
 */
export async function updatePreferenceSettings(data: PreferenceSettingsData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = preferenceSettingsSchema.parse(data);

    await prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        ...validatedData,
      },
      update: validatedData,
    });

    logger.info('Preference settings updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Preferences updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update preferences');
  }
}

/**
 * Update integration settings
 */
export async function updateIntegrationSettings(data: IntegrationSettingsData) {
  try {
    const userId = await checkAdminAuth();
    const validatedData = integrationSettingsSchema.parse(data);

    // Encrypt API Secret if provided
    let encryptedSecret = undefined;
    if (validatedData.cloudinaryApiSecret) {
      encryptedSecret = await encrypt(validatedData.cloudinaryApiSecret);
    }

    // Prepare update data
    const updateData: any = {
      cloudinaryCloudName: validatedData.cloudinaryCloudName,
      cloudinaryApiKey: validatedData.cloudinaryApiKey,
    };

    // Only update secret if a new one is provided
    if (encryptedSecret) {
      updateData.cloudinaryApiSecret = encryptedSecret;
    }

    await prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        ...updateData,
      },
      update: updateData,
    });

    logger.info('Integration settings updated', { userId });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Integration settings updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update integration settings');
  }
}

/**
 * Test Cloudinary connection with provided or existing credentials
 */
export async function testCloudinaryConnection(data?: IntegrationSettingsData) {
  try {
    const userId = await checkAdminAuth();

    let cloudName: string | null = null;
    let apiKey: string | null = null;
    let apiSecret: string | null = null;

    if (data) {
      // Test with provided credentials (before saving)
      cloudName = data.cloudinaryCloudName ?? null;
      apiKey = data.cloudinaryApiKey ?? null;
      apiSecret = data.cloudinaryApiSecret ?? null;
    } else {
      // Test with existing credentials from database or env
      const settings = await prisma.settings.findUnique({
        where: { userId },
      });

      const envConfig = getCloudinaryEnvConfig();
      cloudName = settings?.cloudinaryCloudName || envConfig.cloudName;
      apiKey = settings?.cloudinaryApiKey || envConfig.apiKey;
      apiSecret = envConfig.apiSecret; // From env as we don't decrypt from DB
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        message: 'Cloudinary credentials not configured. Please provide all required fields.',
      };
    }

    // Test the connection using Cloudinary API
    const isValidFormat = 
      cloudName.length > 0 && 
      apiKey.length > 0 && 
      apiSecret.length > 0;

    if (!isValidFormat) {
      return { success: false, message: 'Invalid credential format' };
    }

    // Configure Cloudinary
    cloudinary.config({ 
      cloud_name: cloudName, 
      api_key: apiKey, 
      api_secret: apiSecret 
    });
    
    // Ping Cloudinary API
    await cloudinary.api.ping();

    logger.info('Cloudinary connection test successful', { userId, cloudName });
    return {
      success: true,
      message: 'Connection successful! Cloudinary credentials are valid.',
    };
  } catch (error) {
    return handleServerActionError(error, 'Connection test failed. Please verify your credentials.');
  }
}

/**
 * Update profile settings (name, email, avatar)
 */
export async function updateProfileSettings(data: ProfileSettingsData) {
  try {
    const userId = await checkAdminAuth();
    
    const validatedData = profileSettingsSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed
    if (validatedData.email !== user.email) {
      // REQUIRE PASSWORD for email change
      if (!validatedData.currentPassword) {
        return { 
          success: false, 
          message: 'Current password is required to change email address',
          requiresPassword: true 
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.password);
      if (!isValidPassword) {
        logger.warn('Failed password verification for email change', { userId });
        return { success: false, message: 'Incorrect password' };
      }

      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Store code
      await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerificationCode: verificationCode,
          emailVerificationExpires: expiresAt,
        },
      });

      // Send verification email
      // We need to import sendEmail dynamically or ensure it's available
      // For now, we'll assume it's available or add the import
      const { sendEmail } = await import('@/lib/email-service');
      await sendEmail({
        to: validatedData.email, // Send to NEW email
        subject: 'Verify your new email address',
        html: `
          <h2>Verify Email Change</h2>
          <p>You requested to change your email address to this one.</p>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code expires in 15 minutes.</p>
        `,
      });

      logger.info('Email verification code sent', { userId, newEmail: validatedData.email });

      return { 
        success: false, // Not fully successful yet
        message: 'Verification code sent to new email',
        requiresVerification: true 
      };
    }

    // Update user profile (excluding email if it hasn't changed or if waiting for verification)
    // If email didn't change, we just update name and image
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        image: validatedData.image || null,
      },
    });

    logger.info('Profile settings updated', { userId, changes: ['name', 'image'] });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to update profile');
  }
}

/**
 * Verify and complete email change
 */
export async function verifyEmailChange(code: string, newEmail: string) {
  try {
    const userId = await checkAdminAuth();
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.emailVerificationCode || !user.emailVerificationExpires) {
      return { success: false, message: 'No pending email verification' };
    }

    if (new Date() > user.emailVerificationExpires) {
      return { success: false, message: 'Verification code expired' };
    }

    if (code !== user.emailVerificationCode) {
      logger.warn('Invalid email verification code attempt', { userId });
      return { success: false, message: 'Invalid verification code' };
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return { success: false, message: 'Email already in use' };
    }

    // Update email and clear verification fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    });

    logger.info('Email address changed successfully', { userId, newEmail });
    revalidatePath('/admin/settings');
    return { success: true, message: 'Email updated successfully' };
  } catch (error) {
    return handleServerActionError(error, 'Failed to verify email');
  }
}

/**
 * Upload company logo to Cloudinary
 */
export async function uploadCompanyLogo(formData: FormData) {
  try {
    await checkAdminAuth();

    const file = formData.get('file');
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Upload to Cloudinary via existing upload API
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const { url } = await response.json();

    return { success: true, url };
  } catch (error) {
    return handleServerActionError(error, 'Failed to upload logo');
  }
}

/**
 * Upload company dark mode logo to Cloudinary
 */
export async function uploadCompanyLogoDark(formData: FormData) {
  try {
    await checkAdminAuth();

    const file = formData.get('file');
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Upload to Cloudinary via existing upload API
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const { url } = await response.json();

    return { success: true, url };
  } catch (error) {
    return handleServerActionError(error, 'Failed to upload dark logo');
  }
}

/**
 * Upload favicon to Cloudinary
 */
export async function uploadFavicon(formData: FormData) {
  try {
    await checkAdminAuth();

    const file = formData.get('file');
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Upload to Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const { url } = await response.json();

    return { success: true, url };
  } catch (error) {
    return handleServerActionError(error, 'Failed to upload favicon');
  }
}

/**
 * Upload user avatar to Cloudinary
 */
export async function uploadUserAvatar(formData: FormData) {
  try {
    await checkAdminAuth();

    const file = formData.get('file');
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Upload to Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const { url } = await response.json();

    return { success: true, url };
  } catch (error) {
    return handleServerActionError(error, 'Failed to upload avatar');
  }
}
