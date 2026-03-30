'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SolarPanelPrice } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface MarketAreaChartProps {
  prices: SolarPanelPrice[];
}

export function MarketAreaChart({ prices }: MarketAreaChartProps) {
  // Aggregate average price over time
  const timePoints = prices[0]?.priceHistory.map((_, i) => {
    const avgPrice =
      prices.reduce((sum, p) => sum + (p.priceHistory[i]?.price || 0), 0) / prices.length;
    const maxPrice = Math.max(...prices.map((p) => p.priceHistory[i]?.price || 0));
    const minPrice = Math.min(...prices.map((p) => p.priceHistory[i]?.price || 0));
    return {
      time: new Date(prices[0].priceHistory[i].timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      avg: parseFloat(avgPrice.toFixed(2)),
      max: parseFloat(maxPrice.toFixed(2)),
      min: parseFloat(minPrice.toFixed(2)),
    };
  }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Price Range (24h)</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-live" />
          Streaming
        </span>
      </CardHeader>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timePoints}>
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
            <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} interval="preserveStartEnd" />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area type="monotone" dataKey="max" stroke="#6366f1" fill="url(#colorMax)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="avg" stroke="#06b6d4" fill="url(#colorAvg)" strokeWidth={2} />
            <Area type="monotone" dataKey="min" stroke="#10b981" fill="none" strokeWidth={1} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
