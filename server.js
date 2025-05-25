// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas definidas
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



// Rotas

//app.get('/', (req, res) => {
//  res.send('API funcionando!');
//});


// Inicializa o servidor

//app.listen(PORT, () => {
//  console.log(`Servidor rodando na porta ${PORT}`);
//});