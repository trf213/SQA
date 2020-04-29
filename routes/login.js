const express = require('express');
const path = require('path');
const time = require('express-timestamp')

let databasePath = '../utils/database';
if (process.env.NODE_ENV === 'test') {
  databasePath = '../utils/test-database';
}
const database = require(databasePath);
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

express().use(time.init);
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
    db.query(Q.UpdateLog, [ req.session.userID]);
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
<<<<<<< HEAD
        db.query(Q.UpdateLogs, [ rows[0].userID, true ]);
=======
        db.query(Q.UpdateLogs, [  ]);
>>>>>>> 95c64ddc12da63862fe5b72c62b5ba72fb865c5c
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

  const errors = checkGuestSecurityInput(guestName, childName);

  if (errors.length > 0) {
    res.status(401).json({ error: errors });
    return;
  }
 
  db.query(Q.UpdateGuestUser, [ guestName, childName, req.session.userID ])
    .then(function([rows, fieldData]) {
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
        db.query(Q.UpdateLogs, [ adminID, true ]);
        
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


// Helper functions
const checkGuestSecurityInput = function(guestName, childName) {
  const errors = [];
  if (guestName.length === 0) {
    errors.push('Guest name cannot be empty');
  }
  if (childName.length === 0) {
    errors.push('Child name cannot be empty');
  }
  if (guestName.length > 20) {
    errors.push('Guest name must be less than 20 characters');
  }
  if (childName.length > 20) {
    errors.push('Child name must be less than 20 characters');
  }
  
  return errors;
}

module.exports = router;