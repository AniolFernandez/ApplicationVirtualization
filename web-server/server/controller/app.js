const express = require('express');
const jwt = require('../security/jwt')
const appService = require('../service/app')
const userService = require('../service/user')
const serverService = require('../service/server')
const router = express.Router();

//Obtenció de les apps per a la seva configuració
router.get('/admin-list', async (req, res) => {
  try {
    if (req.isAdmin) {
      res.json(await appService.getAppsForConfig());
    }
    else throw new Error("Unauthorized.")
  }
  catch (err) {
    res.json({ error: err.message });
  }
});

//Obtenció de les apps disponibles per a un usuari visitant la pàgina
router.get('/my-apps', async (req, res) => {
  try {
    const filter = {
      isAdmin: req.isAdmin,
      user: req.authUser,
      role: req.authUser ? await userService.getUserRole(req.authUser) : null
    }
    res.json(await appService.getApps(filter));
  }
  catch (err) {
    res.json({ error: "Error al obtenir apps." });
  }
});

//Actualització del cataleg
router.post('/', async (req, res) => {
  try {
    if (req.isAdmin) {
      if (!req.body.docker_image || !req.body.name || !req.body.logo) {
        res.json({ error: 'Falten camps necessaris.' });
      }

      else {
        await appService.updateCatalog(req.body);
        res.json({ success: true });
      }
    }
    else throw new Error("Unauthorized.")
  }
  catch (err) {
    res.json({ error: err.message });
  }
});


//Demana accés a una app a través del seu tag
router.post('/:tag', async (req, res) => {
  try {
    //Comprova que hi hagi el payload amb els servidors
    if (!req.body.servers || req.body.servers.length == 0) {
      res.json({ error: "En aquests moments no hi ha servidors disponibles." });
      return;
    }

    //Comprovem que l'usuari disposa d'accés a l'aplicació
    const filter = {
      isAdmin: req.isAdmin,
      user: req.authUser,
      role: req.authUser ? await userService.getUserRole(req.authUser) : null,
      app: req.params.tag
    }
    if (!await appService.checkAuthorization(filter)) {
      res.json({ error: "No disposes d'autorització per obrir aquesta aplicació." });
      return;
    }

    //Obtenim el servidor al que delegar l'accés
    const destinationServer = serverService.chooseServer(req.body.servers);
    if (destinationServer == null) {
      res.json({ error: "No hi ha cap servidor d'applicacions disponible amb temps de resposta acceptable." });
      return;
    }

    //Retornem el token
    res.json({
      server: destinationServer,
      token: jwt.getAccessToken({
        server: destinationServer,
        app: req.params.tag
      }, { expiresIn: '30s' })
    });
  }
  catch {
    res.json({ error: "Error l'obrir l'aplicació." });
  }
});


module.exports = router;