const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const mapa = require("./mapa.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir imágenes
app.use("/api/img", express.static(path.join(__dirname, "img")));

// Endpoint para mapa
app.get("/api/mapa", (req, res) => {
  res.json(mapa);
});

// Función para generar posición aleatoria sobre césped
function generarPosicion() {
  let x, y;
  do {
    y = Math.floor(Math.random() * mapa.length);
    x = Math.floor(Math.random() * mapa[0].length);
  } while (mapa[y][x] !== 1); // solo césped
  return { x, y };
}

let jugadores = {};

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  // Asignar posición inicial aleatoria
  let pos = generarPosicion();
  jugadores[socket.id] = pos;

  // Enviar lista de jugadores a todos
  io.emit("jugadores", jugadores);

  // Escuchar movimiento
  socket.on("mover", (dir) => {
    let jugador = jugadores[socket.id];
    if (!jugador) return;

    let nuevoX = jugador.x + dir.dx;
    let nuevoY = jugador.y + dir.dy;

    if (
      nuevoY >= 0 &&
      nuevoY < mapa.length &&
      nuevoX >= 0 &&
      nuevoX < mapa[0].length &&
      mapa[nuevoY][nuevoX] === 1 // solo césped
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