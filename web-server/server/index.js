require('dotenv').config();
const express = require('express');
const jwt = require('./security/jwt')
const bodyParser = require('body-parser')
const usersRouter = require('./controller/user');
const port = process.env.PORT || 3000;

//Configuració del servidor
const app = express()
  //Middlewares:
  .use(jwt.processToken)//Autenticació per token
  .use(bodyParser.json());//Parse body a JSON

//ROUTER
app.use('/user', usersRouter);

//Arranca el servidor web
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));