const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Caminho para o arquivo JSON de armazenamento
const arquivo = path.join(__dirname, "../../reclamacoes.json");

// Cria o arquivo se não existir
if (!fs.existsSync(arquivo)) {
  fs.writeFileSync(arquivo, "[]");
}

// Rota que recebe as reclamações
router.post("/", (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem || mensagem.trim() === "") {
    return res.status(400).json({ erro: "Mensagem vazia." });
  }

  // Lê as mensagens atuais
  const dados = JSON.parse(fs.readFileSync(arquivo, "utf-8"));
  dados.push({
    mensagem,
    data: new Date().toLocaleString("pt-BR"),
  });

  // Salva de volta no arquivo
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

  res.status(200).json({ sucesso: true });
});

module.exports = router;
