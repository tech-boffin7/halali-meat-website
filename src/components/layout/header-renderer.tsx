
'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminHeader } from './admin-header';
import UserHeader from './user-header';
import { Skeleton } from '@/components/ui/skeleton';

const HeaderRenderer = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAdminPath = pathname.startsWith('/admin');

  if (status === 'loading' && isAdminPath) {
    return <Skeleton className="h-20 w-full" />;
  }

  return isAdminPath ? <AdminHeader session={session} /> : <UserHeader />;
};

export default HeaderRenderer;
