require('dotenv').config();
const express = require('express');
const usersRouter = require('./controller/user');


const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
const DB_DATABASE = process.env.DB_DATABASE || 'appvirt';

const app = express();
const port = 3000;

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});