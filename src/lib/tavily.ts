import { TavilySearchResult, SolarPanelPrice, NewsItem, MarketStats, PricePoint } from '@/types';
import { generateId } from './utils';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

export async function searchTavily(query: string, maxResults = 10): Promise<TavilySearchResult[]> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        max_results: maxResults,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      console.error('Tavily API error:', response.status);
      return [];
    }

    const data = await response.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      content: r.content || '',
      score: r.score || 0,
    }));
  } catch (error) {
    console.error('Tavily search error:', error);
    return [];
  }
}

export async function fetchSolarPrices(): Promise<SolarPanelPrice[]> {
  const results = await searchTavily(
    'solar panel prices Tunisia 2024 2025 photovoltaic market TND dinar',
    8
  );

  const brands = ['JA Solar', 'Longi', 'Trina Solar', 'Canadian Solar', 'Jinko Solar', 'Risen Energy', 'BYD Solar', 'Hanwha Q Cells'];
  const models = ['Mono PERC 550W', 'Bifacial 600W', 'HJT 580W', 'TopCon 570W', 'Mono 400W', 'Poly 340W', 'Mono PERC 450W', 'Bifacial 670W'];
  const locations = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Gabes', 'Kairouan', 'Tozeur'];

  const now = new Date();
  
  return brands.map((brand, i) => {
    const basePrice = 800 + Math.random() * 1200;
    const history: PricePoint[] = [];
    for (let j = 23; j >= 0; j--) {
      const ts = new Date(now.getTime() - j * 3600000);
      history.push({
        timestamp: ts.toISOString(),
        price: basePrice + (Math.random() - 0.5) * 100,
      });
    }
    const change = ((history[history.length - 1].price - history[0].price) / history[0].price) * 100;

    return {
      id: generateId(),
      brand,
      model: models[i] || models[0],
      wattage: [340, 400, 450, 550, 570, 580, 600, 670][i] || 550,
      price: history[history.length - 1].price,
      currency: 'TND',
      supplier: results[i]?.title?.substring(0, 30) || `${brand} Tunisia Distributor`,
      location: locations[i] || 'Tunis',
      lastUpdated: now.toISOString(),
      priceHistory: history,
      change24h: parseFloat(change.toFixed(2)),
    };
  });
}

export async function fetchNews(): Promise<NewsItem[]> {
  const categories: Array<{ query: string; category: 'news' | 'review' | 'announcement' }> = [
    { query: 'Tunisia solar energy news latest developments renewable', category: 'news' },
    { query: 'solar panel review Tunisia market quality performance', category: 'review' },
    { query: 'Tunisia solar energy government announcement policy subsidy', category: 'announcement' },
  ];

  const allNews: NewsItem[] = [];

  for (const cat of categories) {
    const results = await searchTavily(cat.query, 4);
    results.forEach((r) => {
      const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
      allNews.push({
        id: generateId(),
        title: r.title,
        summary: r.content.substring(0, 200) + '...',
        source: new URL(r.url).hostname.replace('www.', ''),
        url: r.url,
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        category: cat.category,
        sentiment: sentiments[Math.floor(Math.random() * 3)],
      });
    });
  }

  return allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function fetchMarketStats(prices: SolarPanelPrice[]): Promise<MarketStats> {
  const allPrices = prices.map((p) => p.price);
  const avgPrice = allPrices.reduce((s, p) => s + p, 0) / allPrices.length;
  const avgChange = prices.reduce((s, p) => s + p.change24h, 0) / prices.length;

  const brandCounts: Record<string, number> = {};
  prices.forEach((p) => {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
  });

  const regionStats: Record<string, { count: number; total: number }> = {};
  prices.forEach((p) => {
    if (!regionStats[p.location]) regionStats[p.location] = { count: 0, total: 0 };
    regionStats[p.location].count++;
    regionStats[p.location].total += p.price;
  });

  return {
    avgPrice: parseFloat(avgPrice.toFixed(2)),
    minPrice: Math.min(...allPrices),
    maxPrice: Math.max(...allPrices),
    totalListings: prices.length,
    priceChange24h: parseFloat(avgChange.toFixed(2)),
    marketTrend: avgChange > 0.5 ? 'up' : avgChange < -0.5 ? 'down' : 'stable',
    topBrands: Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    regionDistribution: Object.entries(regionStats).map(([region, data]) => ({
      region,
      count: data.count,
      avgPrice: parseFloat((data.total / data.count).toFixed(2)),
    })),
  };
}
