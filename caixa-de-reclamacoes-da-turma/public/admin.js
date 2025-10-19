// ======== LOGIN SIMPLES ========
const senhaCorreta = "vice2025";

document.getElementById("entrar").addEventListener("click", () => {
  const senha = document.getElementById("senha").value.trim();
  const erro = document.getElementById("erro");

  if (senha === senhaCorreta) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("painel").style.display = "block";
    carregarMensagens();
    aplicarTemaSalvo();
  } else {
    erro.textContent = "Senha incorreta. Tente novamente.";
  }
});

// ======== FUNÇÕES DO PAINEL ========

async function carregarMensagens() {
  try {
    const resp = await fetch("/admin-data");
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
    const dados = await resp.json();
    renderizarTabela(dados);
    configurarBusca(dados);
    configurarDownload(dados);
  } catch (err) {
    console.error("❌ Erro ao carregar mensagens:", err);
    document.getElementById("painel").innerHTML =
      `<h2 style="color:red;text-align:center">Erro ao carregar dados: ${err.message}</h2>`;
  }
}

function renderizarTabela(mensagens) {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  if (!mensagens.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhuma mensagem ainda.</td></tr>`;
    return;
  }

  [...mensagens].reverse().forEach((m, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.data}</td>
      <td>${m.mensagem}</td>
      <td><button class="delete-btn" data-index="${mensagens.length - 1 - i}">🗑️ Excluir</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const index = btn.getAttribute("data-index");
      if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return;

      const resp = await fetch(`/admin-delete/${index}`, { method: "DELETE" });
      if (resp.ok) {
        alert("Mensagem excluída com sucesso!");
        carregarMensagens();
      } else {
        alert("Erro ao excluir a mensagem.");
      }
    });
  });
}

function configurarBusca(mensagens) {
  const input = document.getElementById("busca");
  input.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtradas = mensagens.filter((m) =>
      m.mensagem.toLowerCase().includes(texto)
    );
    renderizarTabela(filtradas);
  });
}

function configurarDownload(mensagens) {
  document.getElementById("baixar").addEventListener("click", () => {
    const csv = mensagens
      .map(
        (m) => `"${m.data}","${m.mensagem.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([`Data,Mensagem\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reclamacoes.csv";
    a.click();
  });
}

// ======== TEMA ESCURO/CLARO ========
const btnTema = document.getElementById("toggle-tema");

function aplicarTemaSalvo() {
  const tema = localStorage.getItem("tema") || "claro";
  if (tema === "escuro") {
    document.body.classList.add("dark");
    btnTema.textContent = "☀️ Modo Claro";
  }
}

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const modoEscuro = document.body.classList.contains("dark");
  localStorage.setItem("tema", modoEscuro ? "escuro" : "claro");
  btnTema.textContent = modoEscuro ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});
