export interface SolarPanelPrice {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  price: number;
  currency: string;
  supplier: string;
  location: string;
  lastUpdated: string;
  priceHistory: PricePoint[];
  change24h: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'news' | 'review' | 'announcement';
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MarketStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalListings: number;
  priceChange24h: number;
  marketTrend: 'up' | 'down' | 'stable';
  topBrands: { name: string; count: number }[];
  regionDistribution: { region: string; count: number; avgPrice: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface DashboardData {
  prices: SolarPanelPrice[];
  news: NewsItem[];
  stats: MarketStats;
  lastRefresh: string;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}
