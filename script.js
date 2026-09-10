// Cargar datos desde data.json
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("contenido");

    data.forEach(section => {
      // Crear título
      const h1 = document.createElement("h1");
      h1.textContent = section.title;
      contenedor.appendChild(h1);

      // Crear párrafo con links en lista
      const p = document.createElement("p");
      section.links.forEach(link => {
        const a = document.createElement("a");
        a.href = link.url;
        a.textContent = link.text;
        a.target = "_blank"; // abrir en nueva pestaña
        p.appendChild(a);
        p.appendChild(document.createElement("br")); // salto de línea
      });
      contenedor.appendChild(p);
    });
  })
  .catch(err => console.error("Error cargando JSON:", err));