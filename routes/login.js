const express = require('express');
const path = require('path');

const database = require('../utils/database');
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

router.get('/guest',function(req,res) {
  res.sendFile(path.join(rootDir, 'login.html'));
});

router.get('/admin',function(req,res) {
  res.sendFile(path.join(rootDir, 'loginadmin.html'));
});

router.post('/guest', (req, res) => {
  const guestID = req.body.guestID;
  const password = req.body.password;

  db.query(Q.checkUser, [ guestID, password, 0 ], function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  res.redirect('/home');
});

router.post('/admin', (req, res) => {
  const adminID = req.body.adminID;
  const password = req.body.password;

  db.query(Q.checkUser, [ adminID, password, 1 ], function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  res.redirect('/home');
});

module.exports = router;