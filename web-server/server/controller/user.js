const express = require('express');
const userService = require('../service/user')
const router = express.Router();

router.get('/', (req, res) => {
  const users = [];
  res.json(users);
  /*
  connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
  */
});


router.post('/login', (req, res) => {
  try {
    res.json(userService.login(req.body.username, req.body.password));
  }
  catch {
    res.status(500).send('Error at login');
  }
});


module.exports = router;
