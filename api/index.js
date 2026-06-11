const express = require("express");
const app = express();

// Simulamos un "índice" de páginas raras
const paginas = [
  { titulo: "Onion Market", url: "http://ejemplo.onion" },
  { titulo: "Extraña Wiki", url: "http://ejemplo2.onion" },
  { titulo: "Hidden Blog", url: "http://ejemplo3.onion" }
];

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const resultados = paginas.filter(p => p.titulo.toLowerCase().includes(q));
  res.json(resultados);
});

module.exports = app;