'use client';

import { SettingsCategory } from '@/types/settings';
import { Settings } from '@prisma/client';
import { SettingsContent } from './SettingsContent';
import { SettingsNavbar } from './SettingsNavbar';
import { SettingsSidebar } from './SettingsSidebar';

interface SettingsShellProps {
  settings: Settings | null;
  user: { id: string; name: string; email: string; image: string | null };
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
  onSettingsUpdate: () => void;
}

export function SettingsShell({
  settings,
  user,
  activeCategory,
  onCategoryChange,
  onSettingsUpdate,
}: SettingsShellProps) {
  return (
    <div className="grid min-h-screen md:h-[calc(100vh-80px)] w-full md:grid-cols-[280px_1fr] p-1">
      <SettingsSidebar 
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      <div className="flex flex-col md:overflow-y-auto p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SettingsNavbar 
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <SettingsContent
            activeCategory={activeCategory}
            settings={settings}
            user={user}
            onSettingsUpdate={onSettingsUpdate}
          />
        </main>
      </div>
    </div>
  );
}
