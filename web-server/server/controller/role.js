const express = require('express');
const roleService = require('../service/role')
const router = express.Router();


//Obtenció del llistat de rols
router.get('/all', async (req, res) => {
  try {
    if(req.isAdmin){
      res.json(await roleService.getRoles());
    }
    else throw new Error("Unauthorized.")
  }
  catch {
    res.json({error:"Unauthorized."});
  }
});

module.exports = router;