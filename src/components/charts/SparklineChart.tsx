'use client';

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { PricePoint } from '@/types';

interface SparklineChartProps {
  data: PricePoint[];
  color?: string;
  height?: number;
}

export function SparklineChart({ data, color = '#6366f1', height = 40 }: SparklineChartProps) {
  const chartData = data.map((p) => ({ value: p.price }));
  const min = Math.min(...chartData.map((d) => d.value));
  const max = Math.max(...chartData.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <YAxis domain={[min * 0.99, max * 1.01]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={true}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
