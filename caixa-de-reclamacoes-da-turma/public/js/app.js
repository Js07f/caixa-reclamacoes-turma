const form = document.querySelector('form');
const textarea = document.querySelector('textarea');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensagem = textarea.value.trim();
  if (!mensagem) return alert('Digite algo.');

  try {
    const resp = await fetch('/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem }),
    });

    const data = await resp.json();
    if (data.ok) {
      alert('Mensagem enviada! Valeu 🙌');
      textarea.value = '';
    } else {
      alert('Erro: ' + (data.erro || 'não foi possível enviar'));
    }
  } catch (err) {
    alert('Falha de rede ao enviar');
  }
});
