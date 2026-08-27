// No uses app.listen() en Vercel
export default function handler(req, res) {
  const mapa = [
    [1,1,1,1,1],
    [1,1,1,2,1],
    [1,1,1,2,1],
    [1,2,1,1,1],
    [1,1,1,1,1]
  ];
  res.status(200).json({ mapa });
}