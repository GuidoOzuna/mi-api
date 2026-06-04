const express = require("express");
const path = require("path");
const mapa = require("./mapa.json");

const app = express();
app.use(express.json());

// Servir imágenes desde /api/img
app.use("/api/img", express.static(path.join(__dirname, "img")));

// Endpoint para mapa
app.get("/api/mapa", (req, res) => {
  res.json(mapa);
});

// Lista de jugadores en memoria
let jugadores = {};
const TIEMPO_MAX = 30 * 1000; // 30 segundos

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
  const id = req.body.id;
  if (!id) return res.status(400).json({ error: "Falta ID" });

  if (!jugadores[id]) {
    jugadores[id] = { ...generarPosicion(), lastUpdate: Date.now() };
  } else {
    jugadores[id].lastUpdate = Date.now(); // siempre actualizar
  }

  res.json({ id, pos: jugadores[id] });
});

// Obtener jugadores (limpia duplicados inactivos, no únicos)
app.get("/api/jugadores", (req, res) => {
  const ahora = Date.now();
  const ids = Object.keys(jugadores);

  const vistos = new Set();
  for (let id of ids) {
    if (vistos.has(id)) {
      // si hay duplicados, limpiar los viejos
      if (ahora - jugadores[id].lastUpdate > TIEMPO_MAX) {
        delete jugadores[id];
      }
    } else {
      vistos.add(id);
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
    jugadores[id] = { x: nuevoX, y: nuevoY, lastUpdate: Date.now() };
  } else {
    jugadores[id].lastUpdate = Date.now(); // incluso si no se mueve
  }

  res.json(jugadores[id]);
});

module.exports = app;