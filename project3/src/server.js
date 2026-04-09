require("dotenv").config();

const express = require("express");
const { connectDatabase } = require("./db");
const Visitor = require("./models/Visitor");

const app = express();
const port = Number(process.env.PORT || 3000);

app.set("trust proxy", true);
app.use(express.json());

app.use(async (req, res, next) => {
  if (req.path === "/health" || req.path.startsWith("/visitors")) {
    return next();
  }

  try {
    await Visitor.create({
      ip: req.ip || "Onbekend",
      userAgent: req.get("user-agent") || "Onbekend",
      path: req.originalUrl,
      referrer: req.get("referer") || "Direct",
      method: req.method
    });
  } catch (error) {
    console.error("Bezoek opslaan mislukt:", error.message);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Express website draait en bezoekers worden opgeslagen in MongoDB Atlas.",
    endpoints: {
      health: "/health",
      visitors: "/visitors?limit=20"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/visitors", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(limit).lean();

    res.json({
      count: visitors.length,
      visitors
    });
  } catch (error) {
    res.status(500).json({ error: "Kon bezoekers niet ophalen." });
  }
});

async function start() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server draait op http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server kon niet starten:", error.message);
    process.exit(1);
  }
}

start();
