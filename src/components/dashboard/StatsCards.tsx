'use client';

import { MarketStats } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency, getChangeColor, getChangeIcon } from '@/lib/utils';

interface StatsCardsProps {
  stats: MarketStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Average Price',
      value: formatCurrency(stats.avgPrice),
      change: stats.priceChange24h,
      icon: '💰',
    },
    {
      label: 'Min Price',
      value: formatCurrency(stats.minPrice),
      change: null,
      icon: '📉',
    },
    {
      label: 'Max Price',
      value: formatCurrency(stats.maxPrice),
      change: null,
      icon: '📈',
    },
    {
      label: 'Total Listings',
      value: stats.totalListings.toString(),
      change: null,
      icon: '📋',
    },
    {
      label: 'Market Trend',
      value: stats.marketTrend.charAt(0).toUpperCase() + stats.marketTrend.slice(1),
      change: stats.priceChange24h,
      icon: stats.marketTrend === 'up' ? '🔺' : stats.marketTrend === 'down' ? '🔻' : '➡️',
    },
    {
      label: 'Top Brands',
      value: stats.topBrands.length.toString(),
      change: null,
      icon: '🏆',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted mb-1">{card.label}</p>
              <p className="text-lg font-bold">{card.value}</p>
              {card.change !== null && (
                <p className={`text-xs mt-1 ${getChangeColor(card.change)}`}>
                  {getChangeIcon(card.change)} {Math.abs(card.change).toFixed(2)}%
                </p>
              )}
            </div>
            <span className="text-xl">{card.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
