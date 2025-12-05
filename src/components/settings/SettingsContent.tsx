'use client';

import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SettingsCategory } from '@/types/settings';
import { Settings } from '@prisma/client';
import { SettingsSkeleton } from './SettingsSkeleton';
import { CompanySettings } from './forms/CompanySettings';
import { EmailSettings } from './forms/EmailSettings';
import { IntegrationSettings } from './forms/IntegrationSettings';
import { NotificationSettings } from './forms/NotificationSettings';

import { ProfileSettings } from './forms/ProfileSettings';
import { SecuritySettings } from './forms/SecuritySettings';

interface SettingsContentProps {
  activeCategory: SettingsCategory;
  settings: Settings | null;
  user: { id: string; name: string; email: string; image: string | null };
  onSettingsUpdate: (settings: Settings | null) => void;
  isMobile?: boolean;
  isLoading?: boolean;
}

export function SettingsContent({ activeCategory, settings, user, onSettingsUpdate, isLoading }: SettingsContentProps) {
  if (isLoading) {
    return <SettingsSkeleton />;
  }

  const content = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSettings user={user} onUpdate={onSettingsUpdate} />;
      case 'company':
        return <CompanySettings settings={settings} onUpdate={onSettingsUpdate} />;
      case 'email':
        return <EmailSettings settings={settings} onUpdate={onSettingsUpdate} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onUpdate={onSettingsUpdate} />;
      case 'security':
        return <SecuritySettings onUpdate={onSettingsUpdate} />;
      case 'integrations':
        return <IntegrationSettings settings={settings} onUpdate={onSettingsUpdate} />;

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      {content()}
    </ErrorBoundary>
  );
}
