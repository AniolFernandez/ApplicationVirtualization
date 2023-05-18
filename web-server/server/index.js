require('dotenv').config();
const express = require('express');
const jwt = require('./security/jwt')
const cors = require('cors');
const bodyParser = require('body-parser')
const usersRouter = require('./controller/user');
const roleRouter = require('./controller/role');
const appRouter = require('./controller/app');
const appserverRouter = require('./controller/server');
const fs = require('fs');
const https = require('https');
const port = process.env.PORT || 3000;
const SECURE = !process.env.HTTP;

//Configuració del servidor
const app = express()
  //Middlewares:
  .use(jwt.processToken)//Autenticació per token
  .use(cors({ origin: '*' }))//Habilita l'accés des de qualsevol origen
  .use(bodyParser.json());//Parse body a JSON

//Contingut estàtic de la web
app.use(express.static('web-client'));

//ROUTER
app.use('/user', usersRouter);
app.use('/role', roleRouter);
app.use('/app', appRouter);
app.use('/server', appserverRouter);

//Arranca el servidor web
if (SECURE) {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  }, app).listen(port, "0.0.0.0", () => console.log(`Server listening at http://0.0.0.0:${port}`));
}
else
  app.listen(port, "0.0.0.0", () => console.log(`Server listening at http://0.0.0.0:${port}`));