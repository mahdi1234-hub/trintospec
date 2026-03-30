'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Card({ children, className, gradient }: CardProps) {
  if (gradient) {
    return (
      <div className="gradient-border">
        <div className={cn('p-4', className)}>{children}</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-4 transition-colors hover:bg-card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-foreground/80', className)}>
      {children}
    </h3>
  );
}
