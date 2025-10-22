document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const text = document.getElementById("text");

  // 🔔 Popup animado
  const aviso = document.createElement("div");
  aviso.className = "popup-msg";
  document.body.appendChild(aviso);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensagem = text.value.trim();

    if (!mensagem) {
      mostrarAviso("⚠️ Escreve algo antes de enviar!", "erro");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem }),
      });

      const data = await res.json();

      if (data.ok) {
        mostrarAviso("🌱 Mensagem enviada com sucesso!", "sucesso");
        text.value = "";
      } else {
        mostrarAviso("❌ Erro ao enviar mensagem!", "erro");
      }
    } catch (err) {
      console.error("Erro no envio:", err);
      mostrarAviso("🚫 Falha na conexão com o servidor!", "erro");
    }
  });

  function mostrarAviso(msg, tipo) {
    aviso.textContent = msg;
    aviso.classList.add("mostrar", tipo);
    setTimeout(() => aviso.classList.remove("mostrar", tipo), 3000);
  }
});
