import express from "express";

const app = express();

// API para devolver lista de imágenes
app.get("/api/galeria", (req, res) => {
  const imagenes = [
    { src: "/img/foto1.jpg", title: "Paisaje" },
    { src: "/img/foto2.jpg", title: "Ciudad" },
    { src: "/img/foto3.jpg", title: "Montaña" }
  ];
  res.json(imagenes);
});

// Exportar como handler (sin app.listen)
export default app;