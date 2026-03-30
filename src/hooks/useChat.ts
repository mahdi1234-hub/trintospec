'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, DashboardData } from '@/types';
import { generateId } from '@/lib/utils';

export function useChat(dashboardData: DashboardData | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Welcome to TrintoSpec AI! I can help you analyze real-time solar panel market data in Tunisia. Ask me about prices, trends, brands, or market insights.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const buildContext = useCallback((): string => {
    if (!dashboardData) return 'No data available yet.';
    const { prices, stats, news } = dashboardData;
    return JSON.stringify({
      market_stats: stats,
      top_prices: prices.slice(0, 5).map((p) => ({
        brand: p.brand,
        model: p.model,
        price: p.price,
        change: p.change24h,
        location: p.location,
      })),
      recent_news: news.slice(0, 5).map((n) => ({
        title: n.title,
        category: n.category,
        sentiment: n.sentiment,
      })),
      last_refresh: dashboardData.lastRefresh,
    });
  }, [dashboardData]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const apiMessages = messages
          .filter((m) => m.role !== 'system')
          .concat(userMessage)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            dashboardContext: buildContext(),
          }),
        });

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.response || 'Sorry, I could not process that.',
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: 'Sorry, there was an error. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, buildContext]
  );

  return { messages, isLoading, sendMessage };
}
