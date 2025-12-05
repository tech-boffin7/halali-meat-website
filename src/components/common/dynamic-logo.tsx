'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DynamicLogoProps {
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function DynamicLogo({ 
  lightLogoUrl, 
  darkLogoUrl, 
  alt = "Company Logo",
  width = 120,
  height = 50,
  className = ""
}: DynamicLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(
    lightLogoUrl || '/images/logo/logo-light.png'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const isDark = theme === 'dark' || resolvedTheme === 'dark';
    const defaultLogo = isDark 
      ? '/images/logo/logo-dark.png' 
      : '/images/logo/logo-light.png';
    
    // Priority: Use dark logo in dark mode if available, fallback to light logo, then default
    const customLogo = isDark 
      ? (darkLogoUrl || lightLogoUrl)
      : (lightLogoUrl || darkLogoUrl);
    
    setLogoSrc(customLogo || defaultLogo);
  }, [theme, resolvedTheme, lightLogoUrl, darkLogoUrl, mounted]);

  // Prevent hydration mismatch by showing placeholder until mounted
  if (!mounted) {
    return (
      <div style={{ width, height }} className={className} />
    );
  }

  return (
    <Image 
      src={logoSrc} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      priority
    />
  );
}
