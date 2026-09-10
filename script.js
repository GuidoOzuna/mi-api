// Cargar imágenes desde la API de Vercel
fetch("/api/galeria")
  .then(res => res.json())
  .then(data => {
    const galeria = document.getElementById("galeria");
    data.forEach(img => {
      const image = document.createElement("img");
      image.src = img.src;
      image.alt = img.title;
      galeria.appendChild(image);
    });
  })
  .catch(err => console.error("Error cargando imágenes:", err));