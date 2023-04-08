const express = require('express');
const appService = require('../service/app')
const router = express.Router();

//Obtenció de les apps que no han estat registrades
router.get('/unregistered', async (req, res) => {
  try {
    if(req.isAdmin){
      res.json(await appService.getUnregisteredApps());
    }
    else throw new Error("Unauthorized.")
  }
  catch(err) {
    res.json({error:err.message});
  }
});


module.exports = router;