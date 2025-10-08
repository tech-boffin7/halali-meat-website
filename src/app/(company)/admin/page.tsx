import Link from 'next/link';
import {
  Package,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { QuotesChart } from '@/components/dashboard/QuotesChart';
import { RecentQuotes } from '@/components/dashboard/RecentQuotes';
import { RecentMessages } from '@/components/dashboard/RecentMessages';

import { getProducts, getQuotes, getContactMessages } from '@/lib/data-access';

async function getDashboardStats() {
    const [products, quotes, messages] = await Promise.all([
        getProducts(),
        getQuotes(),
        getContactMessages(),
    ]);

    const pendingQuotes = quotes.filter((q: any) => q.status === 'pending').length;
    const processedQuotes = quotes.filter((q: any) => q.status === 'processed').length;
    const unreadMessages = messages.filter((m: any) => !m.read).length;

    return {
        totalProducts: products.length,
        totalQuotes: quotes.length,
        pendingQuotes,
        processedQuotes,
        totalMessages: messages.length,
        unreadMessages,
    };
}

const AdminDashboardPage = async () => {
  const stats = await getDashboardStats();

  return (
    <DashboardShell title="Admin Dashboard" description="Overview of your business operations.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          iconName="Package"
          title="Total Products"
          value={stats.totalProducts}
          description="Number of products listed"
        />
        <DashboardStatCard
          iconName="FileText"
          title="Total Quotes"
          value={stats.totalQuotes}
          description="All customer quote requests"
        />
        <DashboardStatCard
          iconName="Clock"
          title="Pending Quotes"
          value={stats.pendingQuotes}
          description="Quotes awaiting processing"
          variant="primary"
        />
        <DashboardStatCard
          iconName="CheckCircle"
          title="Processed Quotes"
          value={stats.processedQuotes}
          description="Quotes that have been handled"
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuotesChart />
        <div className="grid gap-6">
          <RecentQuotes />
          <RecentMessages />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* TopProducts component removed */}
      </div>
    </DashboardShell>
  );
};

export default AdminDashboardPage;