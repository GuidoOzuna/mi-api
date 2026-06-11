async function buscar() {
  const q = document.getElementById("query").value;
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  document.getElementById("buscador").classList.add("arriba");

  const div = document.getElementById("resultados");
  div.innerHTML = "";
  if (data.length === 0) {
    div.innerHTML = "<p>No se encontraron resultados</p>";
  } else {
    data.forEach(r => {
      div.innerHTML += `<p><a href="${r.link}" target="_blank">${r.nombre}</a></p>`;
    });
  }
}

async function sugerir() {
  const q = document.getElementById("query").value;
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  const sugDiv = document.getElementById("sugerencias");
  sugDiv.innerHTML = "";
  data.forEach(r => {
    const sug = document.createElement("div");
    sug.className = "sugerencia";
    sug.textContent = r.nombre;
    sug.onclick = () => {
      document.getElementById("query").value = r.nombre;
      buscar();
    };
    sugDiv.appendChild(sug);
  });
}