'use client';

import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  lastRefresh: string | null;
  onRefresh: () => void;
  loading: boolean;
}

export function Header({ lastRefresh, onRefresh, loading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">TS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              TrintoSpec
            </h1>
            <p className="text-xs text-muted">
              Tunisia Solar Panel Market Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
            <span className="text-xs text-muted">Live Data</span>
          </div>

          {lastRefresh && (
            <span className="text-xs text-muted hidden sm:block">
              Updated: {new Date(lastRefresh).toLocaleTimeString()}
            </span>
          )}

          <Badge variant="info">Tavily AI</Badge>
          <Badge variant="success">Cerebras AI</Badge>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:border-primary/50 hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>&#x21bb;</span>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
