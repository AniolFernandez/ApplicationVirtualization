const express = require('express');
const roleService = require('../service/role')
const router = express.Router();


//Obtenció del llistat de rols
router.get('/all', async (req, res) => {
  try {
    if (req.isAdmin) {
      res.json(await roleService.getRoles());
    }
    else throw new Error("Unauthorized.")
  }
  catch {
    res.json({ error: "Unauthorized." });
  }
});

//Creació d'un nou rol
router.post('/', async (req, res) => {
  try {
    if (req.isAdmin) {
      if (!req.body.rolName)//Comprovem que hi ha payload
        res.json({ error: "No s'ha rebut nom de rol." });
      else {
        let newId = await roleService.afegirRol(req.body.rolName);
        if (newId != null)
          res.json({ id: newId, name: req.body.rolName });
        else
          res.json({ error: "No s'ha pogut afegir. Comprova que el nom no estigui repetit." });
      }
    }
    else throw new Error("Unauthorized.")
  }
  catch(error) {
    res.json({ error: error.message });
  }
});

//Obtenció del llistat de rols
router.delete('/:id', async (req, res) => {
  try {
    if (req.isAdmin) {
      if(!await roleService.deleteRoleById(req.params.id))
        res.json({ error:'Error a l\'eliminar. Comprova que no estigui en ús.' });
      else{
        res.json({ success: true });
      }
    }
    else throw new Error("Unauthorized.")
  }
  catch(error) {
    res.json({ error: error.message });
  }
});



module.exports = router;