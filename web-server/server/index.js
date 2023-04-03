require('dotenv').config();
const express = require('express');
const usersRouter = require('./controller/user');


const port = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_DATABASE = process.env.DB_DATABASE || 'appvirt';

const app = express();

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});