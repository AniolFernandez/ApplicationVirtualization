require('dotenv').config();
const express = require('express');
const jwt = require('./security/jwt')
const cors = require('cors');
const bodyParser = require('body-parser')
const usersRouter = require('./controller/user');
const roleRouter = require('./controller/role');
const appRouter = require('./controller/app');
const appserverRouter = require('./controller/server');
const port = process.env.PORT || 3000;

//Configuració del servidor
const app = express()
  //Middlewares:
  .use(jwt.processToken)//Autenticació per token
  .use(cors({origin: '*'}))//Habilita l'accés des de qualsevol origen
  .use(bodyParser.json());//Parse body a JSON

//ROUTER
app.use('/user', usersRouter);
app.use('/role', roleRouter);
app.use('/app', appRouter);
app.use('/server', appserverRouter);

//Arranca el servidor web
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));