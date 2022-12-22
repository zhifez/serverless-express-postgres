const serverless = require('serverless-http');
const express = require('express');
const app = express();
const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});

app.get('/', async (req, res, next) => {
  const results = await pool.query(`SELECT * FROM users`);

  return res.status(200).json({
    message: 'Hello from root!',
    data: results.rows,
  });
});

app.get('/hello', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path!',
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

module.exports.handler = serverless(app);
