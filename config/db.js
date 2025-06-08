const { Pool } = require('pg');
require('dotenv').config();

const isSSL = process.env.DB_SSL === 'true';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

// Testar a conexão ao inicializar
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
    return;
  }
  console.log('Conexão com o banco estabelecida com sucesso');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};