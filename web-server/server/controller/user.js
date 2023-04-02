const express = require('express');
const connection = require('../db');

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

module.exports = router;
