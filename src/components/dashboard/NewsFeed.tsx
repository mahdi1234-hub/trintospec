'use client';

import { NewsItem } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface NewsFeedProps {
  news: NewsItem[];
}

const categoryVariant: Record<string, 'info' | 'success' | 'warning'> = {
  news: 'info',
  review: 'success',
  announcement: 'warning',
};

const sentimentIcon: Record<string, string> = {
  positive: '🟢',
  negative: '🔴',
  neutral: '🟡',
};

export function NewsFeed({ news }: NewsFeedProps) {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>News, Reviews & Announcements</CardTitle>
        <Badge variant="info">{news.length} items</Badge>
      </CardHeader>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card-hover transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-sm font-medium line-clamp-2 flex-1">{item.title}</h4>
              <span className="text-sm flex-shrink-0">{sentimentIcon[item.sentiment]}</span>
            </div>
            <p className="text-xs text-foreground/50 line-clamp-2 mb-2">{item.summary}</p>
            <div className="flex items-center gap-2">
              <Badge variant={categoryVariant[item.category] || 'info'}>
                {item.category}
              </Badge>
              <span className="text-xs text-muted">{item.source}</span>
              <span className="text-xs text-muted ml-auto">{formatDate(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
