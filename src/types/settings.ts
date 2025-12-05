import { Settings } from '@prisma/client';
import { Bell, Building2, Mail, Plug, Shield, User } from 'lucide-react';

/**
 * Settings type (matching Prisma model)
 */
export type { Settings };

/**
 * Settings category type
 */
export type SettingsCategory = 
  | 'profile' 
  | 'company' 
  | 'email' 
  | 'notifications' 
  | 'security' 
  | 'integrations';

/**
 * Settings navigation item
 */
export interface SettingsNavItem {
  id: SettingsCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

/**
 * Settings categories array
 */
export const SETTINGS_CATEGORIES: SettingsNavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your personal information',
  },
  {
    id: 'company',
    label: 'Company',
    icon: Building2,
    description: 'Update company details and branding',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    description: 'Configure email settings and SMTP',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Manage notification preferences',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Password and security settings',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug,
    description: 'Manage third-party integrations',
  },
];

/**
 * SMTP Configuration
 */
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
 * Integration status
 */
export interface IntegrationStatus {
  name: string;
  connected: boolean;
  lastChecked?: Date;
  message?: string;
}
