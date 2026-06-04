const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 50;

let mapa = [];
let jugadores = {};
let miId = null;
let miNombre = null;

const imgCesped = new Image();
imgCesped.src = "/api/img/cesped.jpeg";
const imgMuro = new Image();
imgMuro.src = "/api/img/muro.png";
const imgPersonaje = new Image();
imgPersonaje.src = "/api/img/personaje.png";

const menu = document.getElementById("menu");
const inputNombre = document.getElementById("nombre");
const btnStart = document.getElementById("btnStart");
const mensaje = document.getElementById("mensaje");
const listaJugadores = document.getElementById("jugadoresConectados");
const controls = document.getElementById("controls");

// Obtener o crear ID único por dispositivo
function obtenerId() {
  let id = localStorage.getItem("miJugadorId");
  if (!id) {
    id = Date.now().toString() + Math.floor(Math.random() * 1000);
    localStorage.setItem("miJugadorId", id);
  }
  return id;
}

// Obtener o crear nombre
function obtenerNombre() {
  return localStorage.getItem("miJugadorNombre");
}

// Mostrar menú
btnStart.addEventListener("click", () => {
  miId = obtenerId();
  miNombre = obtenerNombre();

  if (!miNombre) {
    inputNombre.style.display = "block";
    if (inputNombre.value.trim() !== "") {
      miNombre = inputNombre.value.trim();
      localStorage.setItem("miJugadorNombre", miNombre);
    } else {
      mensaje.textContent = "Ingresa tu nombre para continuar";
      return;
    }
  }

  menu.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "block";

  fetch("/api/jugadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: miId })
  })
  .then(() => {
    mensaje.textContent = `Jugador ${miNombre} conectado`;
    actualizarJugadores();
  });
});

// Cargar mapa
fetch("/api/mapa")
  .then(res => res.json())
  .then(data => {
    mapa = data;
    canvas.width = mapa[0].length * size;
    canvas.height = mapa.length * size;
  });

function actualizarJugadores() {
  fetch("/api/jugadores")
    .then(res => res.json())
    .then(data => {
      jugadores = data;
      dibujarMapa();
      mostrarListaJugadores();
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

function mostrarListaJugadores() {
  listaJugadores.innerHTML = "<b>Jugadores conectados:</b><br>";
  for (let id in jugadores) {
    const nombre = id === miId ? miNombre : `Jugador ${id.slice(-4)}`;
    listaJugadores.innerHTML += `• ${nombre}<br>`;
  }
}

function mover(dx, dy) {
  fetch("/api/mover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: miId, dx, dy })
  }).then(() => actualizarJugadores());
}

// Controles táctiles
document.getElementById("up").addEventListener("click", () => mover(0, -1));
document.getElementById("down").addEventListener("click", () => mover(0, 1));
document.getElementById("left").addEventListener("click", () => mover(-1, 0));
document.getElementById("right").addEventListener("click", () => mover(1, 0));

// Controles con teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") mover(0, -1);
  if (e.key === "ArrowDown") mover(0, 1);
  if (e.key === "ArrowLeft") mover(-1, 0);
  if (e.key === "ArrowRight") mover(1, 0);
});

// Refrescar jugadores cada 2 segundos
setInterval(actualizarJugadores, 2000);