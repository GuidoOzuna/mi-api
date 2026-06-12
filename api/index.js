const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let mensajes = []; // memoria simple en servidor

// recibir mensaje
app.post("/api/chat", (req, res) => {
  const { id, nombre, texto } = req.body;
  const msg = { id, nombre, texto, fecha: new Date().toISOString() };
  mensajes.push(msg);
  res.json({ ok: true });
});

// obtener mensajes
app.get("/api/chat", (req, res) => {
  res.json(mensajes);
});

module.exports = app;