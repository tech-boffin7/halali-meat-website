import { z } from 'zod';

/**
 * Validation schemas for Settings forms
 */

// Profile Settings Schema
export const profileSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  currentPassword: z.string().optional(),
});

export type ProfileSettingsData = z.infer<typeof profileSettingsSchema>;

// Company Settings Schema
export const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').optional().or(z.literal('')),
  companyEmail: z.string()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email format'
    })
    .optional()
    .or(z.literal('')),
  companyPhone: z.string().optional().or(z.literal('')),
  companyAddress: z.string().optional().or(z.literal('')),
  companyWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  companyLogoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  companyLogoDarkUrl: z.string().url('Invalid dark logo URL').optional().or(z.literal('')),
  faviconUrl: z.string().url('Invalid favicon URL').optional().or(z.literal('')),
});

export type CompanySettingsData = z.infer<typeof companySettingsSchema>;

// Email Settings Schema
export const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required').optional().or(z.literal('')),
  smtpPort: z.number().int().min(1).max(65535, 'Port must be between 1-65535').optional(),
  smtpUser: z.string().optional().or(z.literal('')),
  smtpPassword: z.string().optional().or(z.literal('')), // Will be encrypted
  smtpFromEmail: z.string().email('Invalid from email').optional().or(z.literal('')),
  smtpFromName: z.string().optional().or(z.literal('')),
  emailSignature: z.string().optional().or(z.literal('')),
});

export type EmailSettingsData = z.infer<typeof emailSettingsSchema>;

// Notification Preferences Schema
export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  quoteNotifications: z.boolean(),
  messageNotifications: z.boolean(),
  productNotifications: z.boolean(),
});

export type NotificationPreferencesData = z.infer<typeof notificationPreferencesSchema>;

// Security Settings Schema
export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  sessionTimeout: z.number().int().min(300).max(86400).optional(), // 5 min to 24 hours
});

export type SecuritySettingsData = z.infer<typeof securitySettingsSchema>;

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// Preference Settings Schema
export const preferenceSettingsSchema = z.object({
  defaultProductView: z.enum(['grid', 'list']).optional(),
  itemsPerPage: z.number().int().min(10).max(100).optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
});

export type PreferenceSettingsData = z.infer<typeof preferenceSettingsSchema>;

// Combined Settings Schema (for full settings object)
export const settingsSchema = z.object({
  // Company
  ...companySettingsSchema.shape,
  // Email
  ...emailSettingsSchema.shape,
  // Notifications
  ...notificationPreferencesSchema.shape,
  // Preferences
  ...preferenceSettingsSchema.shape,
  // Security
  ...securitySettingsSchema.shape,
});

export type SettingsData = z.infer<typeof settingsSchema>;

// Integration Settings Schema
export const integrationSettingsSchema = z.object({
  cloudinaryCloudName: z.string().optional().or(z.literal('')),
  cloudinaryApiKey: z.string().optional().or(z.literal('')),
  cloudinaryApiSecret: z.string().optional().or(z.literal('')),
});

export type IntegrationSettingsData = z.infer<typeof integrationSettingsSchema>;
