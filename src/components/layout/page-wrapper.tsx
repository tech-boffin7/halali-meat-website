'use client';

import { usePathname } from 'next/navigation';
import HeaderRenderer from './header-renderer';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminLoginPage && <HeaderRenderer />}
      <main className={`flex-grow ${!isAdminLoginPage && !pathname.startsWith('/admin') ? 'pt-20' : ''}`}>{children}</main>
    </div>
  );
}
