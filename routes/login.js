const express = require('express');
const path = require('path');


let databasePath = '../utils/database';
if (process.env.NODE_ENV === 'test') {
  databasePath = '../utils/test-database';
}
const database = require(databasePath);
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

router.get('/guest',function(req,res) {
  if (req.session.userID !== undefined) {
    db.query(Q.getUserByID, [ req.session.userID ])
      .then(([rows, fieldData]) => {
        if (rows.length > 0) {
          return res.redirect(302, '/home');
        }
      })
      .catch((err) => {
        res.end();
        throw err;
      });
  }
  
  res.sendFile(path.join(rootDir, 'login.html'));
});

router.get('/admin',function(req,res) {
  if (req.session.userID !== undefined) {
    db.query(Q.getUserByID, [ req.session.userID ])
      .then(([rows, fieldData]) => {
        if (rows.length > 0) {
          return res.redirect(302, '/home');
        }
      })
      .catch((err) => {
        res.end();
        throw err;
      });
  }

  res.sendFile(path.join(rootDir, 'loginadmin.html'));
});

router.get('/security',function(req,res) {
  if (req.session.userID === undefined) {
    return res.redirect('/');
  } else if (req.session.securityCheck) {
    return res.redirect('/home');
  }

  res.sendFile(path.join(rootDir, 'security.html'));
});

router.get('/logout', function(req,res){
  if(req.session)
  {
    db.query(Q.updateUserLog, [ req.session.userID]);
    req.session.destroy();
    res.redirect('/')
  }
    
});

router.post('/guest', (req, res) => {
  const guestID = req.body.guestID;
  const password = req.body.password;

  const errors = checkUserIdAndPassword(guestID, password);
  if (errors.length > 0) {
    res.status(401).json({ errors: errors });
    return;
  }
  
  db.query(Q.checkUser, [ guestID, password, false ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        req.session.userID = guestID;
        res.redirect(302, '/login/security');
      } else {
        errors.push('Invalid credentials. Either staff ID or password is incorrect.');
        res.status(401).json({
          errors: errors
        });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

router.post('/security', (req, res) => {
  if (req.session.userID === undefined) {
    return res.redirect('/');
  } else if (req.session.securityCheck) {
    return res.redirect('/home');
  }

  const guestName  = req.body.gname;
  const childName  = req.body.cname;

  const errors = checkGuestSecurityInput(guestName, childName);

  if (errors.length > 0) {
    return res.status(401).json({ errors: errors });
  }
 
  db.query(Q.updateGuestUser, [ guestName, childName, req.session.userID ])
    .then(function([rows, fieldData]) {
      if (rows.affectedRows > 0) {
        db.query(Q.insertNewUserLog, [ req.session.userID, true ])
          .then(() => {
            req.session.securityCheck = true;
            return res.redirect(302, '/home');
          })
          .catch((err) => {
            res.end();
            throw err;
          });
      } else {
        errors.push('Something went wrong on saving guest information');
        res.status(401).json({ errors: errors });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

router.post('/admin', (req, res) => {
  const adminID = req.body.adminID;
  const password = req.body.password;

  const errors = checkUserIdAndPassword(adminID, password);
  if (errors.length > 0) {
    res.status(401).json({ errors: errors });
    return;
  }

  db.query(Q.checkUser, [ adminID, password, true ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        req.session.userID = adminID;
        req.session.securityCheck = true;
        db.query(Q.insertNewUserLog, [ adminID, true ])
          .then(() => {
            return res.redirect(302, '/home');
          })
          .catch((err) => {
            res.end();
            throw err;
          });
      } else {
        errors.push('Invalid credentials. Either staff ID or password is incorrect.');
        res.status(401).json({ errors: errors });
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});


// Helper functions
const checkUserIdAndPassword = function(userID, password) {
  const errors = [];

  if (password.length <= 6) {
    errors.push('Password must be at least 6 characters.');
  }
  if (password.length > 20) {
    errors.push('Password must be less than 20 characters.');
  }

  return errors;
}

const checkGuestSecurityInput = function(guestName, childName) {
  const errors = [];

  if (guestName.length === 0) {
    errors.push('Guest name cannot be empty.');
  }
  if (childName.length === 0) {
    errors.push('Child name cannot be empty.');
  }
  if (guestName.length > 20) {
    errors.push('Guest name must be less than 20 characters.');
  }
  if (childName.length > 20) {
    errors.push('Child name must be less than 20 characters.');
  }

  const regex = /^[A-Za-z]/;
  
  if (!regex.test(guestName)) {
    errors.push('Guest name must start with an alphabetical character (A-Z or a-z)');
  }
  if (!regex.test(childName)) {
    errors.push('Child name must start with an alphabetical character (A-Z or a-z)');
  }

  return errors;
}

module.exports = router;