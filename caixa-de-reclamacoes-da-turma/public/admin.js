// 🌐 URL do backend hospedado no Render
const API_BASE = "https://caixa-reclamacoes-turma.onrender.com";

// Senha de acesso ao painel
const senhaCorreta = "vice2025";

// Elementos principais
const loginContainer = document.getElementById("login-container");
const painel = document.getElementById("painel");
const inputSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("entrar");
const erro = document.getElementById("erro");

// 🔐 Login
btnEntrar.addEventListener("click", () => {
  if (inputSenha.value === senhaCorreta) {
    loginContainer.style.display = "none";
    painel.style.display = "block";
    carregarMensagens();
  } else {
    erro.textContent = "Senha incorreta!";
  }
});

// 📋 Carregar mensagens
async function carregarMensagens() {
  const tabela = document.querySelector("#tabela tbody");
  tabela.innerHTML = "<tr><td colspan='3'>⏳ Carregando...</td></tr>";

  try {
    const resp = await fetch(`${API_BASE}/admin-data`);
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
    const dados = await resp.json();

    tabela.innerHTML = "";
    dados.reverse().forEach((msg, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${msg.data}</td>
        <td>${msg.mensagem}</td>
        <td><button onclick="excluirMensagem(${dados.length - 1 - index})">🗑️ Excluir</button></td>
      `;
      tabela.appendChild(tr);
    });

    if (dados.length === 0) {
      tabela.innerHTML = "<tr><td colspan='3'>Nenhuma reclamação ainda 👀</td></tr>";
    }
  } catch (err) {
    tabela.innerHTML = `<tr><td colspan='3' style="color:red">❌ Erro ao carregar dados: ${err.message}</td></tr>`;
  }
}

// 🗑️ Excluir mensagem
async function excluirMensagem(index) {
  if (!confirm("Tem certeza que quer excluir essa mensagem?")) return;

  try {
    const resp = await fetch(`${API_BASE}/admin-delete/${index}`, { method: "DELETE" });
    const data = await resp.json();

    if (data.ok) {
      alert("Mensagem excluída!");
      carregarMensagens();
    } else {
      alert("Erro ao excluir: " + (data.erro || "Desconhecido"));
    }
  } catch {
    alert("Falha na conexão ao excluir mensagem.");
  }
}

// 🔎 Busca em tempo real
document.getElementById("busca").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  document.querySelectorAll("#tabela tbody tr").forEach((tr) => {
    const texto = tr.innerText.toLowerCase();
    tr.style.display = texto.includes(termo) ? "" : "none";
  });
});

// ⬇️ Baixar CSV
document.getElementById("baixar").addEventListener("click", async () => {
  try {
    const resp = await fetch(`${API_BASE}/admin-data`);
    const dados = await resp.json();
    const csv =
      "Data,Mensagem\n" +
      dados.map((d) => `"${d.data}","${d.mensagem.replace(/"/g, "'")}"`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reclamacoes.csv";
    link.click();
  } catch {
    alert("Erro ao baixar CSV");
  }
});

// 🌙 Tema escuro/claro
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
  const escuro = document.body.classList.contains("dark");
  localStorage.setItem("tema", escuro ? "escuro" : "claro");
  btnTema.textContent = escuro ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});
aplicarTemaSalvo();
