async function loadGallery() {
  try {
    // Cargar el archivo JSON con las rutas de las imágenes
    const response = await fetch("images.json");
    const images = await response.json();

    // Seleccionar el contenedor de la galería
    const gallery = document.getElementById("gallery");

    // Recorrer cada objeto del JSON y crear un <img>
    images.forEach(imgData => {
      const img = document.createElement("img");
      img.src = imgData.src;   // ejemplo: "img/foto1.jpg"
      img.alt = imgData.title; // ejemplo: "Paisaje"
      gallery.appendChild(img);
    });
  } catch (error) {
    console.error("Error cargando images.json:", error);
  }
}

// Ejecutar la función al cargar la página
loadGallery();