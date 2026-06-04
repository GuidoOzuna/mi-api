const express = require("express");
const path = require("path");
const mapa = require("./mapa.json");

const app = express();
app.use(express.json());

app.use("/api/img", express.static(path.join(__dirname, "img")));
app.get("/api/mapa", (req, res) => res.json(mapa));

let jugadores = {};
let mensajes = [];
const TIEMPO_MAX = 30 * 1000;

// Generar posición aleatoria sobre césped (1)
function generarPosicion() {
  let x, y;
  do {
    y = Math.floor(Math.random() * mapa.length);
    x = Math.floor(Math.random() * mapa[0].length);
  } while (
    mapa[y][x] !== 1 ||
    Object.values(jugadores).some(p => p.x === x && p.y === y)
  );
  return { x, y };
}

// Crear jugador o devolver existente
app.post("/api/jugadores", (req, res) => {
  const { id, nombre } = req.body;
  if (!id) return res.status(400).json({ error: "Falta ID" });

  if (!jugadores[id]) {
    jugadores[id] = { ...generarPosicion(), nombre: nombre || "Jugador", lastUpdate: Date.now() };
  } else {
    jugadores[id].lastUpdate = Date.now();
    if (nombre) jugadores[id].nombre = nombre;
  }

  res.json({ id, pos: jugadores[id] });
});

// Obtener jugadores (limpia duplicados viejos, no el activo)
app.get("/api/jugadores", (req, res) => {
  const ahora = Date.now();

  // Agrupar jugadores por ID
  const agrupados = {};
  for (let id in jugadores) {
    if (!agrupados[id]) agrupados[id] = [];
    agrupados[id].push(jugadores[id]);
  }

  // Mantener solo el más reciente por ID
  for (let id in agrupados) {
    if (agrupados[id].length > 1) {
      agrupados[id].sort((a, b) => b.lastUpdate - a.lastUpdate);
      // el primero es el activo
      jugadores[id] = agrupados[id][0];
      // eliminar duplicados viejos si pasaron 30s
      for (let i = 1; i < agrupados[id].length; i++) {
        if (ahora - agrupados[id][i].lastUpdate > TIEMPO_MAX) {
          delete agrupados[id][i];
        }
      }
    }
  }

  res.json(jugadores);
});

// Mover jugador
app.post("/api/mover", (req, res) => {
  const { id, dx, dy } = req.body;
  const jugador = jugadores[id];
  if (!jugador) return res.status(404).json({ error: "Jugador no encontrado" });

  const nuevoX = jugador.x + dx;
  const nuevoY = jugador.y + dy;

  if (
    nuevoY >= 0 &&
    nuevoY < mapa.length &&
    nuevoX >= 0 &&
    nuevoX < mapa[0].length &&
    mapa[nuevoY][nuevoX] === 1
  ) {
    jugadores[id] = { ...jugador, x: nuevoX, y: nuevoY, lastUpdate: Date.now() };
  } else {
    jugadores[id].lastUpdate = Date.now();
  }

  res.json(jugadores[id]);
});

// Chat
app.post("/api/chat", (req, res) => {
  const { nombre, texto } = req.body;
  if (!texto || !nombre) return res.status(400).json({ error: "Falta nombre o texto" });

  const mensaje = { nombre, texto, tiempo: Date.now() };
  mensajes.push(mensaje);
  if (mensajes.length > 50) mensajes.shift();

  res.json({ ok: true });
});

app.get("/api/chat", (req, res) => {
  res.json(mensajes);
});

// Reset jugadores (solo Guido)
app.post("/api/reset", (req, res) => {
  jugadores = {};
  mensajes.push({ nombre: "Sistema", texto: "⚠️ Guido ha reseteado todos los jugadores", tiempo: Date.now() });
  res.json({ ok: true });
});

module.exports = app;