'use client';

import { SolarPanelPrice } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { formatCurrency, getChangeColor, getChangeIcon } from '@/lib/utils';

interface PriceDataGridProps {
  prices: SolarPanelPrice[];
}

export function PriceDataGrid({ prices }: PriceDataGridProps) {
  return (
    <Card className="col-span-full overflow-hidden">
      <CardHeader>
        <CardTitle>Solar Panel Price Grid</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="info">{prices.length} panels</Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
            Real-time
          </span>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-3 py-2 text-xs font-medium text-muted">Brand</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Model</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Wattage</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Price (TND)</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">24h Change</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Location</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Sparkline (24h)</th>
              <th className="px-3 py-2 text-xs font-medium text-muted">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr
                key={price.id}
                className="border-b border-border/50 hover:bg-card-hover transition-colors"
              >
                <td className="px-3 py-2.5 font-medium">{price.brand}</td>
                <td className="px-3 py-2.5 text-foreground/70">{price.model}</td>
                <td className="px-3 py-2.5">
                  <Badge variant="default">{price.wattage}W</Badge>
                </td>
                <td className="px-3 py-2.5 font-semibold">{formatCurrency(price.price)}</td>
                <td className={`px-3 py-2.5 font-medium ${getChangeColor(price.change24h)}`}>
                  {getChangeIcon(price.change24h)} {Math.abs(price.change24h).toFixed(2)}%
                </td>
                <td className="px-3 py-2.5 text-foreground/70">{price.location}</td>
                <td className="px-3 py-2.5 w-[120px]">
                  <SparklineChart
                    data={price.priceHistory}
                    color={price.change24h >= 0 ? '#10b981' : '#ef4444'}
                    height={30}
                  />
                </td>
                <td className="px-3 py-2.5 text-foreground/50 text-xs max-w-[150px] truncate">
                  {price.supplier}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
