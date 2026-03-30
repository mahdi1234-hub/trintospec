import { NextResponse } from 'next/server';
import { fetchSolarPrices, fetchNews, fetchMarketStats } from '@/lib/tavily';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const prices = await fetchSolarPrices();
    const [news, stats] = await Promise.all([
      fetchNews(),
      fetchMarketStats(prices),
    ]);

    return NextResponse.json({
      prices,
      news,
      stats,
      lastRefresh: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
