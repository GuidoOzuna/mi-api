const express = require("express");
const app = express();

app.get("/api/hola", (req, res) => {
  res.json({ mensaje: "Hola Guido desde la API en Vercel!" });
});

module.exports = app;
