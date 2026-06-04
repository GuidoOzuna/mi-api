const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 50;

let mapa = [];
let jugadores = {};
let miId = null;

const imgCesped = new Image();
imgCesped.src = "/api/img/cesped.png";

const imgMuro = new Image();
imgMuro.src = "/api/img/muro.png";

const imgPersonaje = new Image();
imgPersonaje.src = "/api/img/personaje.png";

// Obtener o crear ID único por dispositivo
function obtenerId() {
  let id = localStorage.getItem("miJugadorId");
  if (!id) {
    id = Date.now().toString() + Math.floor(Math.random() * 1000);
    localStorage.setItem("miJugadorId", id);
  }
  return id;
}

// Cargar mapa y crear jugador
fetch("/api/mapa")
  .then(res => res.json())
  .then(data => {
    mapa = data;
    canvas.width = mapa[0].length * size;
    canvas.height = mapa.length * size;

    miId = obtenerId();
    return fetch("/api/jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: miId })
    });
  })
  .then(() => actualizarJugadores())
  .catch(err => console.error("Error:", err));

function actualizarJugadores() {
  fetch("/api/jugadores")
    .then(res => res.json())
    .then(data => {
      jugadores = data;
      dibujarMapa();
    });
}

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
  for (let id in jugadores) {
    const p = jugadores[id];
    ctx.drawImage(imgPersonaje, p.x * size, p.y * size, size, size);
  }
}

function mover(dx, dy) {
  fetch("/api/mover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: miId, dx, dy })
  })
    .then(() => actualizarJugadores());
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") mover(0, -1);
  if (e.key === "ArrowDown") mover(0, 1);
  if (e.key === "ArrowLeft") mover(-1, 0);
  if (e.key === "ArrowRight") mover(1, 0);
});

// Refrescar jugadores cada 2 segundos
setInterval(actualizarJugadores, 2000);