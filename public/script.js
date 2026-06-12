let id = localStorage.getItem("chat_id");
if (!id) {
  id = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("chat_id", id);
}
let nombre = localStorage.getItem("chat_nombre");

function entrar() {
  nombre = document.getElementById("nombre").value;
  if (!nombre) {
    alert("Ingresa un nombre");
    return;
  }
  localStorage.setItem("chat_nombre", nombre);
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
  cargarMensajes();
  setInterval(cargarMensajes, 2000); // refrescar cada 2s
}

async function enviar() {
  const texto = document.getElementById("texto").value;
  if (!texto) return;
  await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nombre, texto })
  });
  document.getElementById("texto").value = "";
  cargarMensajes();
}

async function cargarMensajes() {
  const res = await fetch("/api/chat");
  const data = await res.json();
  const div = document.getElementById("mensajes");
  div.innerHTML = "";
  data.forEach(m => {
    div.innerHTML += `<p><b>${m.nombre}:</b> ${m.texto}</p>`;
  });
}

// conectar botones
document.getElementById("btnEntrar").addEventListener("click", entrar);
document.getElementById("btnEnviar").addEventListener("click", enviar);

// si ya hay nombre guardado, entrar directo
if (nombre) {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
  cargarMensajes();
  setInterval(cargarMensajes, 2000);
}