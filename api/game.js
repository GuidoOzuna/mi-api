import express from "express";
const app = express();

app.get("/api/game", (req, res) => {
  const mapa = [
    [1,1,1,1,1],
    [1,1,1,2,1],
    [1,1,1,2,1],
    [1,2,1,1,1],
    [1,1,1,1,1]
  ];
  res.json({ mapa });
});

export default app;