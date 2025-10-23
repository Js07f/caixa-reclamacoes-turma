const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Caminhos dos arquivos de armazenamento
const ARQUIVO_TURMA = path.join(__dirname, '../reclamacoes.json');
const ARQUIVO_AFS = path.join(__dirname, '../reclamacoes_afs.json');

// 🔐 Senha do painel AFS (pode mudar depois ou colocar em variável de ambiente no Render)
const SENHA_ADMIN_AFS = process.env.SENHA_ADMIN_AFS || 'afs123';

// Garante que ambos existam
if (!fs.existsSync(ARQUIVO_TURMA)) fs.writeFileSync(ARQUIVO_TURMA, '[]');
if (!fs.existsSync(ARQUIVO_AFS)) fs.writeFileSync(ARQUIVO_AFS, '[]');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Teste rápido
app.get('/ping', (_, res) => res.json({ ok: true, msg: 'pong' }));

// 📨 Envio de mensagens - versão TURMA
app.post('/enviar', (req, res) => {
  salvarMensagem(req, res, ARQUIVO_TURMA);
});

// 📨 Envio de mensagens - versão AFS
app.post('/enviar_afs', (req, res) => {
  salvarMensagem(req, res, ARQUIVO_AFS);
});

// 📊 Admin-data TURMA
app.get('/admin-data', (_, res) => listarMensagens(res, ARQUIVO_TURMA));

// 📊 Admin-data AFS
app.get('/admin-data-afs', (_, res) => listarMensagens(res, ARQUIVO_AFS));

// 🗑️ Deletar mensagem TURMA
app.delete('/admin-delete/:index', (req, res) => excluirMensagem(req, res, ARQUIVO_TURMA));

// 🗑️ Deletar mensagem AFS
app.delete('/admin-delete-afs/:index', (req, res) => excluirMensagem(req, res, ARQUIVO_AFS));

// 🔐 Login admin AFS
app.post('/login_afs', (req, res) => {
  const { senha } = req.body;
  if (senha === SENHA_ADMIN_AFS) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, erro: 'Senha incorreta' });
});

// 📄 Páginas HTML
app.get('/afs', (_, res) => res.sendFile(path.join(__dirname, '../public/afs.html')));
app.get('/admin_afs', (_, res) => res.sendFile(path.join(__dirname, '../public/admin_afs.html')));
app.get('/login_afs', (_, res) => res.sendFile(path.join(__dirname, '../public/login_afs.html')));
app.get('/admin', (_, res) => res.sendFile(path.join(__dirname, '../public/admin.html')));

// --- Funções utilitárias ---
function salvarMensagem(req, res, arquivo) {
  try {
    const { mensagem } = req.body;
    if (!mensagem?.trim()) return res.status(400).json({ ok: false, erro: 'Mensagem vazia' });

    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
    const novaMensagem = { mensagem: mensagem.trim(), data: new Date().toLocaleString('pt-BR') };
    dados.push(novaMensagem);
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

    console.log('📩 Nova mensagem salva em', arquivo);
    return res.json({ ok: true });
  } catch (err) {
    console.error('❌ Erro ao salvar mensagem:', err);
    res.status(500).json({ ok: false, erro: 'Erro no servidor' });
  }
}

function listarMensagens(res, arquivo) {
  try {
    const dados = fs.existsSync(arquivo)
      ? JSON.parse(fs.readFileSync(arquivo, 'utf-8'))
      : [];
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao ler arquivo' });
  }
}

function excluirMensagem(req, res, arquivo) {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index)) return res.status(400).json({ erro: 'Índice inválido' });

    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
    if (index < 0 || index >= dados.length)
      return res.status(404).json({ erro: 'Mensagem não encontrada' });

    dados.splice(index, 1);
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('❌ Erro ao excluir mensagem:', err);
    res.status(500).json({ erro: 'Erro ao excluir mensagem' });
  }
}

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server ativo em http://localhost:${PORT}`);
  console.log(`📮 Caixa Turma: / e /admin`);
  console.log(`🌱 Caixa AFS: /afs e /admin_afs`);
  console.log(`🔐 Login AFS: /login_afs`);
});
