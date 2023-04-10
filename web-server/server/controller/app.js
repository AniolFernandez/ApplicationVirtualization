const express = require('express');
const appService = require('../service/app')
const router = express.Router();

//Obtenció de les apps per a la seva configuració
router.get('/admin-list', async (req, res) => {
  try {
    if(req.isAdmin){
      res.json(await appService.getAppsForConfig());
    }
    else throw new Error("Unauthorized.")
  }
  catch(err) {
    res.json({error:err.message});
  }
});

//Actualització del cataleg
router.post('/', async (req, res) => {
    try {
      if(req.isAdmin){
        if(!req.body.docker_image || !req.body.name || !req.body.logo){
          res.json({error:'Falten camps necessaris.'});
        }
           
        else{
            await appService.updateCatalog(req.body);
            res.json({success: true});
        }
        
        
        //res.json(await appService.getAppsForConfig());
      }
      else throw new Error("Unauthorized.")
    }
    catch(err) {
      res.json({error:err.message});
    }
  });


module.exports = router;