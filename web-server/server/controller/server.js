const express = require('express');
const appserverService = require('../service/server')
const router = express.Router();

//Keepalive dels servidors d'aplicacions
router.post('/keepalive', async (req, res) => {
    try {
        if (req.isAdmin) {
            appserverService.keepalive(req.ip);
            res.json({});
        }
        else throw new Error("Unauthorized.")
    }
    catch (err) {
        res.json({ error: err.message });
    }
});


module.exports = router;