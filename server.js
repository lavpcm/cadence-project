const express = require('express');
const app = express();
const PORT = 3000;


// Rotas
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});