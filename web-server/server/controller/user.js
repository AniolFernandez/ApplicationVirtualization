const express = require('express');
const userService = require('../service/user')
const router = express.Router();
const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Login dels usuaris
router.post('/login', (req, res) => {
  try {
    res.json(userService.login(req.body.username, req.body.password));
  }
  catch {
    res.status(500).send('Error at login');
  }
});


//Registre dels usuaris
router.post('/signup', (req, res) => {
  try {
    //Validació dades d'entrada
    if (!req.body.password || !req.body.username || !req.body.email){
      res.json({error:"Has d'emplenar tots els camps."});
      return;
    }

    if (!email_regex.test(req.body.email)) {
      res.json({error:"Has d'introduïr un correu vàlid."});
      return;
    }

    if (req.body.password.length < 8) {
      res.json({error:"La contrasenya és massa feble. Utilitza com a mínim 8 caràcters."});
      return;
    }

    if (req.body.password !== req.body.password2) {
      res.json({error:"Les contrasenyes no coincideixen."});
      return;
    }

    if (userService.existeixUsuari(req.body.username)){
      res.json({error:"Ja existeix un usuari amb aquest nom d'usuari."});
      return;
    }


    //Registre de l'usuari
    if (!userService.registrarUsuari(req.body.username, req.body.password, req.body.email)){
      res.json({error:"Error durant el registre."});
      return;
    }

    //Obtenim el token i el retornem
    res.json({token: userService.login(req.body.username, req.body.password, true)});
  }
  catch(err) {
    console.log("Error al signup: " + err);
    res.status(500).send('Error at login');
  }
});


module.exports = router;
