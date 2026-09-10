// Usar los datos definidos en data.js
window.addEventListener("DOMContentLoaded", function() {
  var contenedor = document.getElementById("contenido");

  datos.forEach(function(section) {
    // Crear título
    var h1 = document.createElement("h1");
    h1.textContent = section.title;
    contenedor.appendChild(h1);

    // Crear párrafo con links
    var p = document.createElement("p");
    section.links.forEach(function(link) {
      var a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.text;
      a.target = "_blank";
      p.appendChild(a);
      p.appendChild(document.createElement("br"));
    });
    contenedor.appendChild(p);
  });
});