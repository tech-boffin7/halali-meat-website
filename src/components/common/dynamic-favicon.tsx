'use client';

import { useEffect } from 'react';

interface DynamicFaviconProps {
  faviconUrl?: string | null;
}

export function DynamicFavicon({ faviconUrl }: DynamicFaviconProps) {
  useEffect(() => {
    const favicon = faviconUrl || '/favicon.svg';
    
    // Find existing favicon link or create new one
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    
    if (link) {
      link.href = favicon;
    } else {
      link = document.createElement('link');
      link.rel = 'icon';
      link.href = favicon;
      document.head.appendChild(link);
    }
  }, [faviconUrl]);

  return null; // This component doesn't render anything visible
}
