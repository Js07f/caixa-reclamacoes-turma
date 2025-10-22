document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("mensagens");

  async function carregarMensagens() {
    try {
      const res = await fetch("http://localhost:3001/admin-data");
      const dados = await res.json();

      if (!dados.length) {
        lista.innerHTML = `<p style="color:#bbb;text-align:center;">Nenhuma mensagem recebida ainda 🌱</p>`;
        return;
      }

      // 🔄 Mostra as mensagens mais recentes primeiro
      lista.innerHTML = [...dados]
        .reverse()
        .map(
          (m, i) => `
          <div class="msg fade-in">
            <p>${m.mensagem}</p>
            <small>${m.data}</small>
            <button class="delete" data-index="${dados.length - 1 - i}">🗑️</button>
          </div>`
        )
        .join("");

      // 🗑️ Botões de excluir
      document.querySelectorAll(".delete").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (confirm("Excluir esta mensagem?")) {
            await fetch(`http://localhost:3001/admin-delete/${btn.dataset.index}`, {
              method: "DELETE",
            });
            carregarMensagens();
          }
        });
      });
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
      lista.innerHTML = `<p style="color:#f66;text-align:center;">Erro ao carregar mensagens.</p>`;
    }
  }

  carregarMensagens();
});
