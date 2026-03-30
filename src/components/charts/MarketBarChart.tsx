'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MarketStats } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface MarketBarChartProps {
  stats: MarketStats;
}

export function MarketBarChart({ stats }: MarketBarChartProps) {
  const data = stats.regionDistribution.map((r) => ({
    name: r.region,
    avgPrice: r.avgPrice,
    listings: r.count,
  }));

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg Price by Region (TND)</CardTitle>
      </CardHeader>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" horizontal={false} />
            <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="avgPrice" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
