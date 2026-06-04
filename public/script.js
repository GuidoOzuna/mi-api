const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 50;

let mapa = [];
let personaje = { x: 0, y: 0 };

// Cargar imágenes desde la API
const imgCesped = new Image();
imgCesped.src = "/api/img/cesped.png";

const imgMuro = new Image();
imgMuro.src = "/api/img/muro.png";

const imgPersonaje = new Image();
imgPersonaje.src = "/api/img/personaje.png";

// Cargar mapa desde la API
fetch("/api/mapa")
  .then(res => res.json())
  .then(data => {
    mapa = data;

    // Ajustar tamaño del canvas según el mapa
    canvas.width = mapa[0].length * size;
    canvas.height = mapa.length * size;

    // Buscar posición inicial del personaje (0 en el mapa)
    for (let y = 0; y < mapa.length; y++) {
      for (let x = 0; x < mapa[y].length; x++) {
        if (mapa[y][x] === 0) {
          personaje.x = x;
          personaje.y = y;
          mapa[y][x] = 1; // convertir en césped
        }
      }
    }

    dibujarMapa();
  })
  .catch(err => {
    console.error("Error cargando el mapa:", err);
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText("Error cargando mapa", 20, 40);
  });

function dibujarMapa() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[y].length; x++) {
      if (mapa[y][x] === 1) {
        ctx.drawImage(imgCesped, x * size, y * size, size, size);
      } else if (mapa[y][x] === 2) {
        ctx.drawImage(imgMuro, x * size, y * size, size, size);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(x * size, y * size, size, size);
      }
      ctx.strokeRect(x * size, y * size, size, size);
    }
  }
  // Dibujar personaje encima
  ctx.drawImage(imgPersonaje, personaje.x * size, personaje.y * size, size, size);
}

function mover(dx, dy) {
  const nuevoX = personaje.x + dx;
  const nuevoY = personaje.y + dy;
  if (mapa[nuevoY] && mapa[nuevoY][nuevoX] === 1) {
    personaje.x = nuevoX;
    personaje.y = nuevoY;
  }
  dibujarMapa();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") mover(0, -1);
  if (e.key === "ArrowDown") mover(0, 1);
  if (e.key === "ArrowLeft") mover(-1, 0);
  if (e.key === "ArrowRight") mover(1, 0);
});