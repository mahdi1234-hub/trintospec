'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { Header } from '@/components/dashboard/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PriceDataGrid } from '@/components/dashboard/PriceDataGrid';
import { NewsFeed } from '@/components/dashboard/NewsFeed';
import { PerspectiveViewer } from '@/components/dashboard/PerspectiveViewer';
import { PriceLineChart } from '@/components/charts/PriceLineChart';
import { MarketBarChart } from '@/components/charts/MarketBarChart';
import { MarketAreaChart } from '@/components/charts/MarketAreaChart';
import { BrandPieChart } from '@/components/charts/BrandPieChart';
import { ChatPanel } from '@/components/chat/ChatPanel';

export default function DashboardPage() {
  const { data, loading, error, refresh } = useDashboardData();

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-primary rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        lastRefresh={data?.lastRefresh || null}
        onRefresh={refresh}
        loading={loading}
      />

      <main className="px-6 py-6 space-y-6 pb-24">
        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[350px] bg-card rounded-xl animate-pulse" />
              <div className="h-[350px] bg-card rounded-xl animate-pulse" />
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Stats Overview */}
            <StatsCards stats={data.stats} />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PriceLineChart prices={data.prices} />
              <MarketAreaChart prices={data.prices} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MarketBarChart stats={data.stats} />
              <BrandPieChart prices={data.prices} />
              <NewsFeed news={data.news} />
            </div>

            {/* Data Grid */}
            <PriceDataGrid prices={data.prices} />

            {/* Perspective Interactive Explorer */}
            <PerspectiveViewer />
          </>
        )}
      </main>

      {/* AI Chat Panel */}
      <ChatPanel dashboardData={data} />
    </div>
  );
}
