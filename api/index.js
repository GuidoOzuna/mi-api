const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const mapa = require("./mapa.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir imágenes desde /api/img
app.use("/api/img", express.static(path.join(__dirname, "img")));

// Endpoint para el mapa
app.get("/api/mapa", (req, res) => {
  res.json(mapa);
});

// Generar posición aleatoria sobre césped (1)
function generarPosicion(jugadores) {
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

let jugadores = {};

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  // Asignar posición inicial aleatoria
  const pos = generarPosicion(jugadores);
  jugadores[socket.id] = pos;

  io.emit("jugadores", jugadores);

  // Movimiento del jugador
  socket.on("mover", (dir) => {
    const jugador = jugadores[socket.id];
    if (!jugador) return;

    const nuevoX = jugador.x + dir.dx;
    const nuevoY = jugador.y + dir.dy;

    if (
      nuevoY >= 0 &&
      nuevoY < mapa.length &&
      nuevoX >= 0 &&
      nuevoX < mapa[0].length &&
      mapa[nuevoY][nuevoX] === 1
    ) {
      jugadores[socket.id] = { x: nuevoX, y: nuevoY };
      io.emit("jugadores", jugadores);
    }
  });

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    delete jugadores[socket.id];
    io.emit("jugadores", jugadores);
  });
});

module.exports = server;