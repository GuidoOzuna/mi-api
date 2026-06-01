const express = require("express");
const app = express();
const mapa = require("./mapa.json");

// Endpoint para devolver el mapa
app.get("/api/mapa", (req, res) => {
  res.json(mapa);
});

// Exportar la app para que Vercel la use
module.exports = app;
