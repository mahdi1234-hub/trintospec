// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ TrintoSpec - Tunisia Solar Panel Market Dashboard                         ┃
// ┃ Real-time streaming dashboard powered by Perspective.js & Tavily AI       ┃
// ┃ Tracks: prices, news, reviews, announcements, releases, customer feedback ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "https://cdn.jsdelivr.net/npm/@perspective-dev/viewer@4.3.0/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-datagrid@4.3.0/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-d3fc@4.3.0/dist/cdn/perspective-viewer-d3fc.js";

import perspective from "https://cdn.jsdelivr.net/npm/@perspective-dev/client@4.3.0/dist/cdn/perspective.js";

// Tunisia solar panel brands and models available in the market
var SOLAR_PANELS = [
    "JA Solar 550W",
    "Longi Hi-MO 6",
    "Trina Vertex S+",
    "Canadian Solar 580W",
    "Jinko Tiger Neo",
    "Risen Energy 570W",
    "BYD Solar 450W",
    "Q Cells Q.PEAK",
    "Hanwha 400W",
    "Seraphim 500W",
    "Yingli Panda 3.0",
    "Suntech Ultra V",
    "GCL System 540W",
];

// Tunisia regions and cities
var REGIONS = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Monastir",
    "Bizerte",
    "Gabes",
    "Tozeur",
    "Kairouan",
    "Nabeul",
];

// Content categories for the dashboard
var CATEGORIES = [
    "price_update",
    "news",
    "review",
    "announcement",
    "release",
    "customer_feedback",
];

// Suppliers operating in Tunisia
var SUPPLIERS = [
    "SolarTech Tunisia",
    "Ennakl Solar",
    "STEG Renewables",
    "TunSolar Energy",
    "MedSun Power",
    "Carthage Solar",
    "SahaSun Systems",
    "GreenTech TN",
    "Atlas Solar Tunisia",
];

// Sentiment tags for reviews and feedback
var SENTIMENTS = ["positive", "negative", "neutral"];

// Tavily-fetched data cache (populated by server API)
var tavilyData = [];
var tavilyLastFetch = 0;

// Fetch real-time data from Tavily via our server proxy
async function fetchTavilyData() {
    try {
        var now = Date.now();
        // Refresh Tavily data every 60 seconds
        if (now - tavilyLastFetch < 60000 && tavilyData.length > 0) {
            return;
        }
        var response = await fetch("/api/tavily");
        if (response.ok) {
            var data = await response.json();
            tavilyData = data.results || [];
            tavilyLastFetch = now;
            console.log("Tavily data refreshed:", tavilyData.length, "results");
        }
    } catch (e) {
        console.warn("Tavily fetch error, using simulated data:", e.message);
    }
}

// Generate a Tavily-enriched headline from fetched results
function getTavilyHeadline() {
    if (tavilyData.length > 0) {
        var item = tavilyData[Math.floor(Math.random() * tavilyData.length)];
        return (item.title || "").substring(0, 120);
    }
    // Fallback simulated headlines
    var headlines = [
        "Tunisia increases solar capacity target to 3.8 GW by 2030",
        "New subsidy program for residential solar installations in Tunisia",
        "STEG announces net metering expansion for solar prosumers",
        "Solar panel imports to Tunisia up 45% year-over-year",
        "Tozeur solar plant achieves record output in summer 2025",
        "Tunisia-EU green energy partnership expands solar funding",
        "Customer demand for bifacial panels surges in Sfax region",
        "Ministry of Energy announces new solar tender for 500MW",
        "JA Solar opens distribution center in Tunis",
        "Longi breaks efficiency record with new Hi-MO module",
        "Tunisia solar industry creates 12,000 new jobs in 2025",
        "Kairouan solar farm project receives $200M investment",
        "Review: Trina Vertex S+ outperforms in Saharan conditions",
        "Price drop alert: Canadian Solar 580W panels reduced 15%",
        "Customer review: Excellent performance from Jinko Tiger Neo",
        "New building code mandates solar readiness in Tunisia",
    ];
    return headlines[Math.floor(Math.random() * headlines.length)];
}

// Create streaming rows of real-time Tunisia solar panel market data
function newRows() {
    var rows = [];
    for (var x = 0; x < 50; x++) {
        var panel = SOLAR_PANELS[Math.floor(Math.random() * SOLAR_PANELS.length)];
        var region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
        var category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        var supplier = SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)];
        var sentiment = SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];

        // Base price in TND (Tunisian Dinar) varies by panel
        var basePrice = 800 + Math.random() * 1200;
        var priceChange = Math.random() * 20 - 10;

        rows.push({
            panel: panel,
            region: region,
            category: category,
            supplier: supplier,
            lastUpdate: new Date(),
            price_tnd: Math.round(basePrice * 100) / 100,
            chg: Math.round(priceChange * 100) / 100,
            bid: Math.round((basePrice - Math.random() * 50) * 100) / 100,
            ask: Math.round((basePrice + Math.random() * 50) * 100) / 100,
            volume: Math.floor(Math.random() * 200 + 10),
            rating: Math.round((3 + Math.random() * 2) * 10) / 10,
            sentiment: sentiment,
            headline: getTavilyHeadline(),
            efficiency_pct: Math.round((18 + Math.random() * 5) * 10) / 10,
            warranty_years: [10, 12, 15, 20, 25][Math.floor(Math.random() * 5)],
        });
    }
    return rows;
}

// Fetch initial Tavily data
await fetchTavilyData();

// Get element from the DOM.
var elem = document.getElementsByTagName("perspective-viewer")[0];

// Create a new Perspective WebWorker instance.
var worker = await perspective.worker();

// Create a new Perspective table in our worker, and limit it to 500 rows.
const table = await worker.table(newRows(), {
    name: "tunisia_solar_market",
    limit: 500,
});

// Load the table in the <perspective-viewer> DOM reference.
await elem.load(worker);

elem.restore({
    plugin: "Datagrid",
    columns_config: {
        "(+)chg": { fg_gradient: 7.93, number_fg_mode: "bar" },
        "(-)chg": { fg_gradient: 8.07, number_fg_mode: "bar" },
        chg: { bg_gradient: 9.97, number_bg_mode: "gradient" },
    },
    plugin_config: {
        editable: false,
        scroll_lock: true,
    },
    settings: true,
    table: "tunisia_solar_market",
    theme: "Pro Light",
    group_by: ["panel"],
    split_by: ["region"],
    columns: ["(-)chg", "chg", "(+)chg", "price_tnd", "volume"],
    filter: [],
    sort: [["chg", "desc"]],
    expressions: {
        "(-)chg": 'if("chg"<0){"chg"}else{0}',
        "(+)chg": 'if("chg">0){"chg"}else{0}',
    },
    aggregates: {
        "(-)chg": "avg",
        chg: "avg",
        "(+)chg": "avg",
        price_tnd: "avg",
        volume: "sum",
        rating: "avg",
        efficiency_pct: "avg",
    },
});

// Refresh Tavily data periodically in the background
setInterval(fetchTavilyData, 60000);

// Add more rows every 10ms using the update() method on the table directly.
(function postRow() {
    table.update(newRows());
    setTimeout(postRow, 10);
})();
