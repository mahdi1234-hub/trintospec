# TrintoSpec - Tunisia Solar Panel Market Dashboard

Real-time interactive streaming dashboard for the Tunisian solar panel market, built with [Perspective.js](https://perspective.finos.org/) and powered by [Tavily AI](https://tavily.com/) for live data extraction.

## What it tracks

- **Solar panel prices** (TND) - real-time bid/ask/change across all major brands
- **News feed** - latest Tunisia solar energy developments
- **Customer reviews** - ratings and sentiment analysis
- **Announcements** - government policy and subsidy updates
- **New releases** - latest solar panel models entering the market
- **Regional data** - prices and volume across 9 Tunisian regions

## Tech Stack

- **[Perspective.js](https://perspective.finos.org/)** - FINOS high-performance streaming data visualization
- **[Tavily AI](https://tavily.com/)** - Real-time web data extraction and search
- **Express.js** - Lightweight server for Tavily API proxy

## Quick Start

```bash
git clone https://github.com/mahdi1234-hub/trintospec.git
cd trintospec
npm install
```

Set your Tavily API key:
```bash
cp .env.example .env.local
# Edit .env.local with your key
```

Run:
```bash
TAVILY_API_KEY=your_key_here npm start
```

Open http://localhost:3000

## Files

| File | Description |
|------|-------------|
| `index.html` | Perspective viewer page |
| `index.css` | Viewer positioning styles |
| `streaming.js` | Real-time data streaming with Tavily integration |
| `server.js` | Express server with Tavily API proxy |

## Dashboard Features

The Perspective viewer supports:
- **Datagrid** - sortable, filterable data table
- **D3FC Charts** - bar, line, area, scatter, treemap charts
- Click column headers to sort
- Drag columns to pivot/group
- Right-click for chart type switching
- Real-time streaming updates every 10ms

## License

MIT
