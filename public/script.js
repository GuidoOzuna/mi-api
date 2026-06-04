const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 50;

let mapa = [];
let jugadores = {};

const imgCesped = new Image();
imgCesped.src = "/api/img/cesped.jpeg";

const imgMuro = new Image();
imgMuro.src = "/api/img/muro.png";

const imgPersonaje = new Image();
imgPersonaje.src = "/api/img/personaje.png";

// Conectar con Socket.IO
const socket = io();

// Recibir lista de jugadores
socket.on("jugadores", (data) => {
  jugadores = data;
  dibujarMapa();
});

// Cargar mapa desde API
fetch("/api/mapa")
  .then(res => res.json())
  .then(data => {
    mapa = data;
    canvas.width = mapa[0].length * size;
    canvas.height = mapa.length * size;
    dibujarMapa();
  });

function dibujarMapa() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[y].length; x++) {
      ctx.drawImage(imgCesped, x * size, y * size, size, size);
      if (mapa[y][x] === 2) {
        ctx.drawImage(imgMuro, x * size, y * size, size, size);
      }
    }
  }
  // Dibujar todos los jugadores
  for (let id in jugadores) {
    let p = jugadores[id];
    ctx.drawImage(imgPersonaje, p.x * size, p.y * size, size, size);
  }
}

function mover(dx, dy) {
  socket.emit("mover", { dx, dy });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") mover(0, -1);
  if (e.key === "ArrowDown") mover(0, 1);
  if (e.key === "ArrowLeft") mover(-1, 0);
  if (e.key === "ArrowRight") mover(1, 0);
});