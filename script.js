async function loadGallery() {
  const response = await fetch("images.json");
  const images = await response.json();
  const gallery = document.getElementById("gallery");

  images.forEach(imgData => {
    const img = document.createElement("img");
    img.src = imgData.src;
    img.alt = imgData.title;
    gallery.appendChild(img);
  });
}

loadGallery();