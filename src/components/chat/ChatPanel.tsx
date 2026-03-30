'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, DashboardData } from '@/types';
import { useChat } from '@/hooks/useChat';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface ChatPanelProps {
  dashboardData: DashboardData | null;
}

export function ChatPanel({ dashboardData }: ChatPanelProps) {
  const { messages, isLoading, sendMessage } = useChat(dashboardData);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const quickQuestions = [
    'What is the cheapest solar panel available?',
    'Compare JA Solar vs Longi prices',
    'What are the market trends today?',
    'Best value panels in Tunis region?',
  ];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-[420px] h-[600px]' : 'w-[360px] h-[500px]'
      }`}
    >
      <Card className="h-full flex flex-col !p-0 shadow-2xl shadow-primary/10 border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">TrintoSpec AI</h3>
              <p className="text-[10px] text-muted">Cerebras-powered assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Online</Badge>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted hover:text-foreground text-xs"
            >
              {isExpanded ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted text-xs">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[10px] px-2 py-1 rounded-full border border-border hover:border-primary/50 hover:bg-card-hover transition-colors text-foreground/70"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about solar panels..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-card-hover border border-border rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className={`text-[9px] mt-1 ${isUser ? 'text-white/50' : 'text-muted'}`}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
