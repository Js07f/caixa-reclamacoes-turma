const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Caminho do arquivo de armazenamento
const ARQUIVO = path.join(__dirname, '../reclamacoes.json');

// 🔹 Middleware CORS (permite o front do Netlify acessar o backend no Render)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // depois, se quiser, troque * pelo domínio do Netlify
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Middlewares padrão
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 🔹 Rota de teste (pra Render)
app.get('/ping', (_, res) => res.json({ ok: true, msg: 'pong' }));

// 🔹 Rota para envio das reclamações
app.post('/enviar', (req, res) => {
  try {
    const { mensagem } = req.body;
    if (!mensagem || !mensagem.trim()) {
      return res.status(400).json({ ok: false, erro: 'Mensagem vazia' });
    }

    if (!fs.existsSync(ARQUIVO)) fs.writeFileSync(ARQUIVO, '[]');

    const dados = JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
    const novaMensagem = {
      mensagem: mensagem.trim(),
      data: new Date().toLocaleString('pt-BR'),
    };

    dados.push(novaMensagem);
    fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2));

    console.log('📩 Nova mensagem salva:', novaMensagem);
    return res.json({ ok: true });
  } catch (err) {
    console.error('❌ Erro ao salvar mensagem:', err);
    return res.status(500).json({ ok: false, erro: 'Erro no servidor' });
  }
});

// 🔹 Rota para listar todas as mensagens (painel admin)
app.get('/admin-data', (req, res) => {
  try {
    const dados = fs.existsSync(ARQUIVO)
      ? JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'))
      : [];
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao ler arquivo' });
  }
});

// 🔹 Rota para excluir mensagens
app.delete('/admin-delete/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index)) return res.status(400).json({ erro: 'Índice inválido' });

    const dados = fs.existsSync(ARQUIVO)
      ? JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'))
      : [];

    if (index < 0 || index >= dados.length)
      return res.status(404).json({ erro: 'Mensagem não encontrada' });

    const removida = dados.splice(index, 1);
    fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2));

    console.log('🗑️ Mensagem excluída:', removida[0]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao excluir mensagem:', err);
    res.status(500).json({ erro: 'Erro interno ao excluir' });
  }
});

// 🔹 Página simples de admin (modo texto)
app.get('/admin', (_, res) => {
  try {
    const dados = fs.existsSync(ARQUIVO)
      ? JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'))
      : [];
    res.send(
      `<h1>📋 Mensagens (${dados.length})</h1><pre>${JSON.stringify(
        dados,
        null,
        2
      )}</pre>`
    );
  } catch (err) {
    res.status(500).send('Erro ao ler mensagens.');
  }
});

// 🔹 Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
