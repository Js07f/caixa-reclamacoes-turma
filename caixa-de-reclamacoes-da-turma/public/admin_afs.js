document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("mensagens");

  async function carregarMensagens() {
    try {
      // 🔹 Usa rota relativa (funciona local e no Render)
      const res = await fetch("/admin-data-afs");
      const dados = await res.json();

      if (!dados.length) {
        lista.innerHTML = `<p style="color:#bbb;text-align:center;">Nenhuma mensagem recebida ainda 🌱</p>`;
        return;
      }

      // Mensagens novas primeiro (ordem invertida)
      dados.reverse();

      lista.innerHTML = dados
        .map(
          (m, i) => `
          <div class="msg fade-in">
            <p>${m.mensagem}</p>
            <small>${m.data}</small>
            <button class="delete" data-index="${i}">🗑️</button>
          </div>`
        )
        .join("");

      document.querySelectorAll(".delete").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (confirm("Excluir esta mensagem?")) {
            await fetch(`/admin-delete-afs/${btn.dataset.index}`, {
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
