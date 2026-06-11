const express = require("express");
const fs = require("fs");
const app = express();

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const data = JSON.parse(fs.readFileSync("data.json"));
  const resultados = data.filter(p => p.nombre.toLowerCase().includes(q));
  res.json(resultados);
});

module.exports = app;