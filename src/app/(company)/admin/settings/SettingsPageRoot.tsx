'use client';

import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SettingsShell } from '@/components/settings/SettingsShell';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsCategory } from '@/types/settings';
import { Settings } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SettingsPageRootProps {
  initialSettings: Settings | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export function SettingsPageRoot({ initialSettings, user: initialUser }: SettingsPageRootProps) {
  const searchParams = useSearchParams();
  const { data: session, update: updateSession } = useSession();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(initialSettings);

  // Use session data if available, fallback to initialUser
  const user = session?.user ? {
    id: (session.user.id || initialUser.id) as string,
    name: session.user.name || initialUser.name,
    email: session.user.email || initialUser.email,
    image: session.user.image || initialUser.image,
  } : initialUser;

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category as SettingsCategory);
    }
    // Short delay to show skeleton (optional for demo purposes)
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Handle settings update - refresh session to get latest user data
  const handleSettingsUpdate = async () => {
    setSettings(null);
    
    // Trigger session refresh to get updated user data
    await updateSession();
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          {/* Content Skeleton */}
          <div className="flex-1">
            <SettingsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SettingsShell 
        settings={settings}
        user={user}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSettingsUpdate={handleSettingsUpdate}
      />
    </ErrorBoundary>
  );
}
