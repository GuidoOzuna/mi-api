// Lista de imágenes directamente en el JS
const images = [
  { src: "img/img1.jpg", title: "Paisaje" },
  { src: "img/foto2.png", title: "Ciudad" },
  { src: "img/foto3.jpeg", title: "Montaña" }
];

const gallery = document.getElementById("gallery");

// Crear elementos <img> para cada foto
images.forEach(imgData => {
  const img = document.createElement("img");
  img.src = imgData.src;
  img.alt = imgData.title;
  gallery.appendChild(img);
});