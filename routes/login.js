const express = require('express');
const path = require('path');

const database = require('../utils/database');
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

const querystring = require('querystring');



router.get('/guest',function(req,res) {
  res.sendFile(path.join(rootDir, 'login.html'));
});

router.get('/admin',function(req,res) {
  res.sendFile(path.join(rootDir, 'loginadmin.html'));
});

router.get('/security/:user',function(req,res) {
  res.sendFile(path.join(rootDir, 'security.html'));
});

router.post('/guest', (req, res) => {
  const guestID = req.body.guestID;
  const password = req.body.password;
  console.log(req.body);
  db.query(Q.checkUser, [ guestID, password, 0 ], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      res.redirect(`/login/security/${guestID}`);
    }else res.redirect('/login/guest');
  });

 
});

router.post('/security/:user', (req, res) => {
  const guestName  = req.body.gname;
  const childName  = req.body.cname;
  console.log(req.originalUrl)
  db.query(Q.UpdateGuestUser, [ req.params.user, guestName, childName], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      res.redirect('/home');
    }
  });

  

  res.redirect('/home');
});

router.post('/admin', (req, res) => {
  const adminID = req.body.name;
  const password = req.body.password;
  console.log(req.body);
  db.query(Q.checkAdminUser, [ adminID, password, 1 ], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      res.redirect('/homeadmin');
    }else res.redirect('/login/admin');
  });
     res.end;

  
});

module.exports = router;