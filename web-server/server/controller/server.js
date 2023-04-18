const express = require('express');
const appserverService = require('../service/server')
const router = express.Router();

//Keepalive dels servidors d'aplicacions
router.post('/keepalive', async (req, res) => {
    try {
        if (req.isAdmin) {
            appserverService.keepalive(req.ip, req.body);
            res.json({});
        }
        else throw new Error("Unauthorized.")
    }
    catch (err) {
        res.json({ error: err.message });
    }
});


//Obtenció dels servidors disponibles
router.get('/', async (req, res) => {
    try {
        if (req.isAdmin) {
            res.json(appserverService.getServers());
        }
        else throw new Error("Unauthorized.")
       
    }
    catch (err) {
        res.json({});
    }
});


//Obtenció del les adreçes dels servidors disponibles
router.get('/getIps', async (req, res) => {
    try {
        res.json(appserverService.getServerIps());
    }
    catch (err) {
        console.log(err);
        res.json([]);
    }
});


module.exports = router;