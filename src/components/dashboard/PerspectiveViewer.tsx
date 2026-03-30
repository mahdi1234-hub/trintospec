'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function PerspectiveViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPerspective() {
      try {
        // Dynamically import Perspective modules
        const perspective = await import('@finos/perspective');
        
        if (cancelled) return;

        // Fetch data from our API
        const response = await fetch('/api/perspective');
        const data = await response.json();

        if (cancelled || !containerRef.current) return;

        // Create a Perspective table
        const worker = await perspective.default.worker();
        const table = await worker.table(data);

        // Create viewer element
        const viewer = document.createElement('perspective-viewer');
        viewer.setAttribute('theme', 'Pro Dark');
        viewer.style.width = '100%';
        viewer.style.height = '400px';

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(viewer);

        // Load the table into the viewer
        await (viewer as any).load(table);

        // Configure the initial view
        await (viewer as any).restore({
          plugin: 'Datagrid',
          columns: ['brand', 'region', 'price_tnd', 'wattage', 'price_per_watt', 'efficiency', 'rating', 'volume_sold'],
          group_by: [],
          sort: [['price_tnd', 'desc']],
        });

        viewerRef.current = viewer;
        setLoaded(true);

        // Set up real-time updates
        const updateInterval = setInterval(async () => {
          try {
            const newResponse = await fetch('/api/perspective');
            const newData = await newResponse.json();
            await table.replace(newData);
          } catch (e) {
            console.error('Perspective update error:', e);
          }
        }, 30000);

        return () => clearInterval(updateInterval);
      } catch (err) {
        console.error('Perspective load error:', err);
        if (!cancelled) {
          setError('Perspective viewer requires browser support for Web Workers and WASM. Showing fallback view.');
        }
      }
    }

    // Load Perspective CSS
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdn.jsdelivr.net/npm/@finos/perspective-viewer/dist/css/themes.css';
    document.head.appendChild(link1);

    // Load Perspective custom elements
    import('@finos/perspective-viewer').catch(() => {});
    import('@finos/perspective-viewer-datagrid').catch(() => {});
    import('@finos/perspective-viewer-d3fc').catch(() => {});

    loadPerspective();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Interactive Data Explorer (Perspective.js)</CardTitle>
        <div className="flex items-center gap-2">
          {loaded && <Badge variant="success">Loaded</Badge>}
          {error && <Badge variant="warning">Fallback</Badge>}
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-live" />
            Interactive
          </span>
        </div>
      </CardHeader>
      <div className="text-xs text-muted mb-2">
        Click column headers to sort, drag columns to pivot, right-click for chart types
      </div>
      <div ref={containerRef} className="min-h-[400px] rounded-lg overflow-hidden border border-border">
        {!loaded && !error && (
          <div className="flex items-center justify-center h-[400px] text-muted">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading Perspective viewer...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4">
            <p className="text-xs text-warning mb-3">{error}</p>
            <FallbackTable />
          </div>
        )}
      </div>
    </Card>
  );
}

function FallbackTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/perspective')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b border-border">
            <th className="px-2 py-1.5 text-left text-muted font-medium">Brand</th>
            <th className="px-2 py-1.5 text-left text-muted font-medium">Region</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">Price (TND)</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">Wattage</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">TND/W</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">Efficiency</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">Rating</th>
            <th className="px-2 py-1.5 text-right text-muted font-medium">Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 50).map((row, i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-card-hover">
              <td className="px-2 py-1.5">{row.brand}</td>
              <td className="px-2 py-1.5 text-foreground/70">{row.region}</td>
              <td className="px-2 py-1.5 text-right font-medium">{row.price_tnd?.toFixed(0)}</td>
              <td className="px-2 py-1.5 text-right">{row.wattage}W</td>
              <td className="px-2 py-1.5 text-right text-accent">{row.price_per_watt?.toFixed(2)}</td>
              <td className="px-2 py-1.5 text-right">{row.efficiency}%</td>
              <td className="px-2 py-1.5 text-right text-warning">{row.rating}</td>
              <td className="px-2 py-1.5 text-right text-foreground/60">{row.volume_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
