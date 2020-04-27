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
  console.log(req.body);
  db.query(Q.checkUser, [ guestID, password, 0 ], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      
      req.session.userID = guestID;
      console.log(req.session.userID );
      res.redirect(`/login/security`);
    }else res.redirect('/login/guest');
  });

 
});

router.post('/security', (req, res) => {
  const guestName  = req.body.gname;
  const childName  = req.body.cname;
 
  db.query(Q.UpdateGuestUser, [  guestName, childName, req.session.userID], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      
      res.redirect('/home');
    }
    res.redirect('/home');
  });

  


});

router.post('/admin', (req, res) => {
  const adminID = req.body.name;
  const password = req.body.password;
  console.log(req.body);
  db.query(Q.checkUser, [ adminID, password, 1 ], function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result.length > 0)
    {
      
      req.session.userID = adminID;
      console.log(req.session.userID );
      res.redirect(`/homeadmin`);
    }else res.redirect('/login/admin');
  });

 
});

module.exports = router;