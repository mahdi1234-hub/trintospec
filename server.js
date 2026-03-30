// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ TrintoSpec Server                                                         ┃
// ┃ Serves static files and proxies Tavily AI API for real-time data          ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

// Serve static files with correct MIME types
app.use(
    express.static(path.join(__dirname, "public"), {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith(".js")) {
                res.setHeader("Content-Type", "application/javascript");
            }
        },
    })
);

// Tavily API proxy endpoint
app.get("/api/tavily", async (req, res) => {
    try {
        if (!TAVILY_API_KEY) {
            return res.json({ results: [], error: "No Tavily API key configured" });
        }

        const queries = [
            "Tunisia solar panel prices 2025 market TND",
            "Tunisia solar energy news latest developments",
            "solar panel review Tunisia customer feedback",
            "Tunisia renewable energy announcement policy",
            "solar panel new release Tunisia market",
        ];

        const query = queries[Math.floor(Math.random() * queries.length)];

        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: TAVILY_API_KEY,
                query: query,
                max_results: 10,
                search_depth: "advanced",
                include_answer: true,
                include_raw_content: false,
            }),
        });

        if (!response.ok) {
            console.error("Tavily API error:", response.status);
            return res.json({ results: [], error: "Tavily API error" });
        }

        const data = await response.json();
        const results = (data.results || []).map((r) => ({
            title: r.title || "",
            url: r.url || "",
            content: (r.content || "").substring(0, 200),
            score: r.score || 0,
        }));

        res.json({ results, answer: data.answer || "" });
    } catch (error) {
        console.error("Tavily proxy error:", error.message);
        res.json({ results: [], error: error.message });
    }
});

// Catch-all: serve index.html for root
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  TrintoSpec - Tunisia Solar Panel Market Dashboard     ┃
┃  Powered by Perspective.js & Tavily AI                 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Server running at http://localhost:${PORT}              ┃
┃  Tavily API: ${TAVILY_API_KEY ? "Configured" : "Not configured (set TAVILY_API_KEY)"}             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `);
});
