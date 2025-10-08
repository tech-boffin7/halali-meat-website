'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer'; // The full footer component

export default function FooterRenderer() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    return null;
  }

  return <Footer />;
}
