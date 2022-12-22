const serverless = require('serverless-http');
const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});
client.connect();

app.get('/', async (req, res, next) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(30),
      email VARCHAR(30)
    );
  `);

  return res.status(200).json({
    message: 'Table created!',
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
