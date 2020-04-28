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

router.get('/security',function(req,res) {
  res.sendFile(path.join(rootDir, 'security.html'));
});

router.get('/logout', function(req,res){
  if(req.session)
  {
    req.session.destroy();
   
    res.redirect('/')
  }
    
});

router.post('/guest', (req, res) => {
  const guestID = req.body.guestID;
  const password = req.body.password;
  
  db.query(Q.checkUser, [ guestID, password, false ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        req.session.userID = guestID;

        res.redirect('/login/security');
      } else {
        res.status(401).json({
          error: 'Invalid credentials. Either guest ID or password is incorrect.'
        });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

router.post('/security', (req, res) => {
  const guestName  = req.body.gname;
  const childName  = req.body.cname;

  console.log({session_userID: req.session.userID});
 
  db.query(Q.UpdateGuestUser, [ guestName, childName, req.session.userID ])
    .then(function([rows, fieldData]) {
      console.log(rows);
      if (rows.affectedRows > 0) {
        res.redirect('/home');
      } else {
        res.status(401).json({
          error: 'Something went wrong on saving guest information'
        });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

router.post('/admin', (req, res) => {
  const adminID = req.body.name;
  const password = req.body.password;

  db.query(Q.checkUser, [ adminID, password, true ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        req.session.userID = adminID;

        res.redirect('/homeadmin');
      } else {
        res.status(401).json({
          error: 'Invalid credentials. Either staff ID or password is incorrect.'
        });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

module.exports = router;