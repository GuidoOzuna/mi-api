// server.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

// Estado del juego
let jugadores = {}; // { id: { nombre, puntos, respuestasHoy, ultimaFecha } }
let preguntas = [
  { texto: "Capital de Paraguay", opciones: ["A) Asunción","B) Encarnación","C) Ciudad del Este"], correcta: "A" },
  { texto: "2+2", opciones: ["A) 3","B) 4","C) 5"], correcta: "B" },
  // ... agrega más preguntas
];

// Registro de jugador
app.post("/registrar", (req,res) => {
  const { id, nombre } = req.body;
  const hoy = new Date().toDateString();
  if (!jugadores[id]) {
    jugadores[id] = { nombre, puntos: 0, respuestasHoy: 0, ultimaFecha: hoy };
  }
  res.json({ ok:true });
});

// Obtener pregunta
app.get("/pregunta/:id", (req,res) => {
  const id = req.params.id;
  const jugador = jugadores[id];
  if (!jugador) return res.json({ error:"No registrado" });

  const hoy = new Date().toDateString();
  if (jugador.ultimaFecha !== hoy) {
    jugador.respuestasHoy = 0; // reset diario
    jugador.ultimaFecha = hoy;
  }

  if (jugador.respuestasHoy >= 10) return res.json({ error:"Ya respondió 10 preguntas hoy" });

  const pregunta = preguntas[Math.floor(Math.random()*preguntas.length)];
  res.json(pregunta);
});

// Responder
app.post("/respuesta", (req,res) => {
  const { id, opcion } = req.body;
  const jugador = jugadores[id];
  if (!jugador) return res.json({ error:"No registrado" });

  const pregunta = preguntas.find(p => p.opciones.some(o => o.startsWith(opcion)));
  if (pregunta && pregunta.correcta === opcion) {
    jugador.puntos++;
  }
  jugador.respuestasHoy++;
  res.json({ puntos: jugador.puntos });
});

// Ranking semanal
app.get("/ranking", (req,res) => {
  const ranking = Object.values(jugadores)
    .sort((a,b) => b.puntos - a.puntos)
    .map(j => ({ nombre:j.nombre, puntos:j.puntos }));
  res.json(ranking);
});

// Reset semanal (domingo a medianoche)
setInterval(() => {
  const ahora = new Date();
  const esDomingo = ahora.getDay() === 0; // 0 = domingo
  const esMedianoche = ahora.getHours() === 0 && ahora.getMinutes() === 0;
  if (esDomingo && esMedianoche) {
    for (let id in jugadores) {
      jugadores[id].puntos = 0; // reset puntos
    }
    console.log("Ranking semanal reiniciado");
  }
}, 60000); // chequea cada minuto

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));