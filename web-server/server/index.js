require('dotenv').config();
const express = require('express');
const usersRouter = require('./controller/user');


const port = process.env.PORT || 3000;

const app = express();

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});