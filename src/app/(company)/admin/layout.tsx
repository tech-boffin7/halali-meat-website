'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminFooter from '@/components/layout/admin-footer';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    async function fetchBadgeCounts() {
      try {
        const [quotesRes, messagesRes] = await Promise.all([
          fetch('/api/quotes/count'),
          fetch('/api/messages/unread'),
        ]);

        if (quotesRes.ok) {
          const quotesData = await quotesRes.json();
          setQuoteCount(quotesData.count || 0);
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessageCount(messagesData.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch badge counts', error);
      }
    }

    // Initial fetch
    fetchBadgeCounts();

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchBadgeCounts, 30000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen md:h-100vh bg-background dark:bg-secondary/50">
      {/* Admin Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        pathname={pathname}
        quoteCount={quoteCount}
        messageCount={messageCount}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}