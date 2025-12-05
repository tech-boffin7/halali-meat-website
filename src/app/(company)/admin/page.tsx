import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { QuotesChart } from '@/components/dashboard/QuotesChart';
import { RecentMessages } from '@/components/dashboard/RecentMessages';
import { RecentQuotes } from '@/components/dashboard/RecentQuotes';
import { getDashboardMetrics, getQuotesChartData, getRecentMessages, getRecentQuotes } from '@/lib/dashboard-service';

const AdminDashboardPage = async () => {
  // Fetch all data in parallel for maximum performance
  const [stats, recentQuotes, recentMessages, chartData] = await Promise.all([
    getDashboardMetrics(),
    getRecentQuotes(),
    getRecentMessages(),
    getQuotesChartData('monthly'), // Default to monthly view
  ]);

  return (
    <DashboardErrorBoundary>
      <DashboardShell title="Admin Dashboard" description="Overview of your business operations.">
        {/* Top Metrics Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            iconName="Package"
            title="Total Products"
            value={stats.totalProducts}
            description={`+${stats.thisMonthProducts} this month`}
            tooltip="Total number of active products in your catalog available for quotes"
          />
          <DashboardStatCard
            iconName="FileText"
            title="Total Quotes"
            value={stats.totalQuotes}
            description={`${stats.thisMonthQuotes} this month`}
            tooltip="All quote requests received from customers across all products"
          />
          <DashboardStatCard
            iconName="Mail"
            title="Total Messages"
            value={stats.totalMessages}
            description={`${stats.thisMonthMessages} this month`}
            tooltip="Total customer messages and inquiries received through the contact form"
          />
          <DashboardStatCard
            iconName="AlertCircle"
            title="Unread Messages"
            value={stats.unreadMessages}
            description="Requires attention"
            variant="primary"
            tooltip="Customer messages that haven't been read yet - requires your attention"
          />
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardStatCard
            iconName="Clock"
            title="Pending Quotes"
            value={stats.pendingQuotes}
            description="Awaiting response"
            variant="primary"
            tooltip="Quote requests waiting for your response - action required"
          />
          <DashboardStatCard
            iconName="CheckCircle"
            title="Responded Quotes"
            value={stats.respondedQuotes}
            description="Successfully handled"
            variant="success"
            tooltip="Quote requests you've already responded to - completed successfully"
          />
          <DashboardStatCard
            iconName="TrendingUp"
            title="Recent Products"
            value={stats.thisMonthProducts}
            description="Added this month"
            tooltip="New products added to your catalog in the current month"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <QuotesChart initialData={chartData.chartData} products={chartData.products} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            <RecentQuotes quotes={recentQuotes} />
            <RecentMessages messages={recentMessages} />
          </div>
        </div>
      </DashboardShell>
    </DashboardErrorBoundary>
  );
};

export default AdminDashboardPage;