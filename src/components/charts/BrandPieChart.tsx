'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SolarPanelPrice } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface BrandPieChartProps {
  prices: SolarPanelPrice[];
}

export function BrandPieChart({ prices }: BrandPieChartProps) {
  const brandData = prices.map((p) => ({
    name: p.brand,
    value: parseFloat(p.price.toFixed(0)),
  }));

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Distribution by Brand</CardTitle>
      </CardHeader>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={brandData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={800}
            >
              {brandData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} TND`, 'Price']}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
