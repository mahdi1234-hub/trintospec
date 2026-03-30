# TrintoSpec - Tunisia Solar Panel Market Dashboard

A fully real-time, interactive AI-powered dashboard for tracking solar panel prices, news, reviews, and market announcements in the Tunisian market.

## Features

- **Real-Time Data**: Live solar panel price tracking with 30-second auto-refresh
- **Interactive Charts**: Line charts, area charts, bar charts, pie charts, and sparklines using Recharts
- **Data Grid**: Comprehensive price table with inline sparklines and real-time updates
- **Perspective.js Explorer**: Interactive data pivot table/chart viewer powered by FINOS Perspective
- **AI Chat Agent**: Cerebras-powered AI assistant that understands dashboard context
- **News Feed**: Real-time news, reviews, and announcements from the Tunisia solar market
- **Tavily AI Integration**: Advanced web search for real-time market data scraping

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Data Explorer**: FINOS Perspective.js
- **AI Search**: Tavily API
- **AI Chat**: Cerebras AI (OpenAI-compatible)
- **Real-time**: Custom polling hooks

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mahdi1234-hub/trintospec.git
cd trintospec
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TAVILY_API_KEY` | Tavily AI API key for real-time data scraping |
| `CEREBRAS_API_KEY` | Cerebras AI API key for the chat agent |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── tavily/     # Solar data fetching endpoint
│   │   ├── chat/       # AI chat endpoint
│   │   └── perspective/ # Perspective data endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/         # Recharts components
│   ├── chat/           # AI chat panel
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API clients
└── types/              # TypeScript type definitions
```

## License

MIT
