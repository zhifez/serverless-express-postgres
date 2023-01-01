const serverless = require('serverless-http');
const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.get('/', async (_, res) => {
  try {
    console.log('connect to db');

    await client.connect();

    console.log('create table if not exists');

    const results = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30)
      );
    `);

    await client.end();

    return res.status(200).json({
      message: 'Table created!',
    });
  } catch (error) {
    return res.status(500).json(error);
  }
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
