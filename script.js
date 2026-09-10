// Lista de imágenes directamente en JS
const imagenes = [
  { src: "/img/foto1.jpg", title: "Paisaje" },
  { src: "/img/foto2.jpg", title: "Ciudad" },
  { src: "/img/foto3.jpg", title: "Montaña" }
];

// Inyectar imágenes en el DOM
window.addEventListener("DOMContentLoaded", () => {
  const galeria = document.getElementById("galeria");
  imagenes.forEach(img => {
    const image = document.createElement("img");
    image.src = img.src;   // Ojo: siempre /img/... porque está en public/img
    image.alt = img.title;
    galeria.appendChild(image);
  });
});