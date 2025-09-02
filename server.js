// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST /echo  -> send JSON and get it back
app.post("/echo", (req, res) => {
  // Basic validation: require a non-empty object
  if (!req.body || typeof req.body !== "object" || !Object.keys(req.body).length) {
    return res.status(400).json({ error: "Send a JSON body" });
  }
  // Typical create endpoint returns 201 Created
  res.status(201).json({ received: req.body });
});

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

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));

// 404 for unknown routes
app.use((req,res) => res.status(404).json({ error: "Not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});
