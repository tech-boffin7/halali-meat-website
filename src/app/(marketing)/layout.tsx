'use client';

import { PublicErrorBoundary } from '@/components/common/PublicErrorBoundary';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicErrorBoundary>{children}</PublicErrorBoundary>;
}
