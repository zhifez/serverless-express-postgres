const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');
const client = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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

      SELECT * from users
    `);

    console.log('results:', results.rowCount);

    await client.end();

    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: results.rows,
    });
  } catch (error) {
    console.log(error);
    await client.end();
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log({ params: req.body });

    if (!name || !email) {
      throw new Error(`"name" and "email" fields are required`);
    }

    console.log('connect to db');

    await client.connect();

    console.log('create user');

    await client.query(`
      INSERT INTO users(name, email)
      VALUES ('${name}', '${email}')
    `);

    await client.end();

    return res.status(200).json({
      message: 'User created',
    });
  } catch (error) {
    console.log(error);
    await client.end();
    return res.status(500).json({
      error: error.message,
    });
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
