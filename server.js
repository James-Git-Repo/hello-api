// server.js
require("dotenv").config();                 // 1) load .env FIRST

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// demo: read GREETING from env
const GREETING = process.env.GREETING || "Hello";
app.get("/config", (req, res) => res.json({ greeting: GREETING, port: PORT }));

// routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.json({ message: "Hello, API 👋" }));
app.get("/greet", (req, res) => {
  const name = (req.query.name || "stranger").toString().trim();
  if (!name) return res.status(400).json({ error: "Name cannot be empty" });
  res.json({ message: `Ciao, ${name}!` });
});
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "id must be a number" });
  res.json({ id: Number(id), ok: true });
});

// POST example
app.post("/echo", (req, res) => {
  if (!req.body || typeof req.body !== "object" || !Object.keys(req.body).length) {
    return res.status(400).json({ error: "Send a JSON body" });
  }
  res.status(201).json({ received: req.body });
});

// 404 + error handlers BEFORE listen (best practice)
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
