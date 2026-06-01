const express = require("express");
const app = express();
const mapa = require("./mapa.json");

app.get("/api/mapa", (req, res) => {
  res.json(mapa);
});

module.exports = app;