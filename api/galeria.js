export default function handler(req, res) {
  const imagenes = [
    { src: "/img/foto1.jpg", title: "Paisaje" },
    { src: "/img/foto2.jpg", title: "Ciudad" },
    { src: "/img/foto3.jpg", title: "Montaña" }
  ];
  res.status(200).json(imagenes);
}