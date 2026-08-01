// server.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

let jugadores = {}; // { id: { nombre, puntos, respuestasHoy, ultimaFecha } }
let preguntas = [
  { texto: "Capital de Paraguay", opciones: ["A) Asunción","B) Encarnación","C) Ciudad del Este"], correcta: "A" },
  { texto: "2+2", opciones: ["A) 3","B) 4","C) 5"], correcta: "B" }
];

// Registrar jugador
app.post("/registrar", (req,res) => {
  const { id, nombre } = req.body;
  const hoy = new Date().toDateString();
  jugadores[id] = jugadores[id] || { nombre, puntos: 0, respuestasHoy: 0, ultimaFecha: hoy };
  res.json({ ok:true });
});

// Pregunta
app.get("/pregunta/:id", (req,res) => {
  const jugador = jugadores[req.params.id];
  if (!jugador) return res.json({ error:"No registrado" });

  const hoy = new Date().toDateString();
  if (jugador.ultimaFecha !== hoy) {
    jugador.respuestasHoy = 0;
    jugador.ultimaFecha = hoy;
  }
  if (jugador.respuestasHoy >= 10) return res.json({ error:"Ya respondió 10 preguntas hoy" });

  const pregunta = preguntas[Math.floor(Math.random()*preguntas.length)];
  res.json(pregunta);
});

// Respuesta
app.post("/respuesta", (req,res) => {
  const { id, opcion } = req.body;
  const jugador = jugadores[id];
  if (!jugador) return res.json({ error:"No registrado" });

  // compara directamente con la correcta
  const ultimaPregunta = preguntas.find(p => p.correcta === opcion);
  if (ultimaPregunta && ultimaPregunta.correcta === opcion) {
    jugador.puntos++;
  }
  jugador.respuestasHoy++;
  res.json({ puntos: jugador.puntos });
});

// Ranking
app.get("/ranking", (req,res) => {
  const ranking = Object.values(jugadores)
    .sort((a,b) => b.puntos - a.puntos)
    .map(j => ({ nombre:j.nombre, puntos:j.puntos }));
  res.json(ranking);
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));