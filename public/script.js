const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 50;
let mapa = [];
let personaje = { x: 0, y: 0 };

async function cargarMapa() {
  const res = await fetch("/api/game");
  const data = await res.json();
  mapa = data.mapa;
  dibujarMapa();
}

function dibujarMapa() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let y=0; y<mapa.length; y++) {
    for (let x=0; x<mapa[y].length; x++) {
      ctx.fillStyle = mapa[y][x] === 1 ? "green" : "brown";
      ctx.fillRect(x*size, y*size, size, size);
      ctx.strokeRect(x*size, y*size, size, size);
    }
  }
  ctx.fillStyle = "red";
  ctx.fillRect(personaje.x*size, personaje.y*size, size, size);
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
  if (e.key === "ArrowUp") mover(0,-1);
  if (e.key === "ArrowDown") mover(0,1);
  if (e.key === "ArrowLeft") mover(-1,0);
  if (e.key === "ArrowRight") mover(1,0);
});

cargarMapa();