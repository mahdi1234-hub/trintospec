'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SolarPanelPrice } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface PriceLineChartProps {
  prices: SolarPanelPrice[];
}

export function PriceLineChart({ prices }: PriceLineChartProps) {
  // Merge price histories into a single timeline
  const timePoints = prices[0]?.priceHistory.map((_, i) => {
    const point: Record<string, any> = {
      time: new Date(prices[0].priceHistory[i].timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    prices.forEach((p) => {
      if (p.priceHistory[i]) {
        point[p.brand] = parseFloat(p.priceHistory[i].price.toFixed(2));
      }
    });
    return point;
  }) || [];

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Solar Panel Price Trends (24h)</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
          Live
        </span>
      </CardHeader>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timePoints}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
            <XAxis
              dataKey="time"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {prices.slice(0, 5).map((p, i) => (
              <Line
                key={p.brand}
                type="monotone"
                dataKey={p.brand}
                stroke={colors[i]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={800}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
