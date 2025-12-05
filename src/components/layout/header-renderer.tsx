'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminHeader } from './admin-header';
import UserHeader from './user-header';

const HeaderRenderer = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const isAdminPath = pathname.startsWith('/admin');

  useEffect(() => {
    // Fetch settings for logo URLs
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.settings);
        }
      })
      .catch(() => {
        // Silently fail, will use default logos
      });
      
    // Fetch user profile for profile picture (only for admin paths)
    if (isAdminPath) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUserProfile(data.user);
          }
        })
        .catch(() => {
          // Silently fail, will use session data
        });
    }
  }, [isAdminPath]);

  if (status === 'loading' && isAdminPath) {
    return <Skeleton className="h-20 w-full" />;
  }

  const logoProps = {
    lightLogoUrl: settings?.companyLogoUrl,
    darkLogoUrl: settings?.companyLogoDarkUrl,
  };

  // Create enhanced session with fresh user data
  const enhancedSession = session && userProfile ? {
    ...session,
    user: {
      ...session.user,
      ...userProfile,  // Override with fresh data from API
    }
  } : session;

  return isAdminPath ? (
    <AdminHeader session={enhancedSession} {...logoProps} />
  ) : (
    <UserHeader {...logoProps} />
  );
};

export default HeaderRenderer;
