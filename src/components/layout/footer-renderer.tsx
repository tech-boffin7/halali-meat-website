'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from './footer';

export default function FooterRenderer() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const [settings, setSettings] = useState<any>(null);

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
  }, []);

  if (isAdminPath) {
    return null;
  }

  const logoProps = {
    lightLogoUrl: settings?.companyLogoUrl,
    darkLogoUrl: settings?.companyLogoDarkUrl,
  };

  return <Footer {...logoProps} />;
}
