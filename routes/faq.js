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

router.use((req, res, next) => {
  if (req.session.userID === undefined) {
    res.redirect(302, '/');
    return;
  }

  next();  
});

router.get('/', (req, res, next) => {
  db.query(Q.getUserByID, [ req.session.userID ])
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        if (rows[0].isAdmin === 1) {
          return res.redirect(302, '/faq/admin');
        } else {
          return res.redirect(302, '/faq/guest');
        }
      }
    })
    .catch((err) => {
      res.end();
      throw err;
    })
});

router.get('/guest', (req, res) => {
  db.query(Q.userType, [ req.session.userID, false])
  .then(function([rows, fieldData]) {
    if (rows.length > 0) {
      res.sendFile(path.join(rootDir, 'faq.html'));
    } else {
      res.redirect('/home');
    }
  })
  .catch(function(err) {
    res.end();
    throw err;
  });
});

router.get('/select', (req, res) => {
  db.query(Q.getFAQs)
    .then(([rows, fieldData]) => {
      db.query(Q.getMostRecentFAQLogs).then(function([logrows,fieldData]){
        res.status(200).json({faq: rows, faq_log: logrows});
      });
        
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});


/** PREVENT ACCESS TO ADMIN ROUTES IF NOT AN ADMIN */
router.use((req, res, next) => {
  db.query(Q.userType, [ req.session.userID, true ])
    .then(([rows, fieldData]) => {
      if (rows.length === 0) {
        return res.redirect('/home');
      }
      
      // If user is found and is admin user, process admin routes
      next();
    })
    .catch((err) => {
      res.end();
      throw err;
    });
})

router.get('/admin', (req,res) => {
    res.sendFile(path.join(rootDir, 'faqadmin.html'));
});

router.post('/add', (req,res) =>{
  const ques = req.body.ques;
  const answer = req.body.answer;

  const errors = checkQuesAndAnswer(ques, answer);
  if (errors.length > 0) {
    return res.status(401).json({ errors: errors });
  }
  
  db.query(Q.insertFAQ, [ques, answer])
    .then(function([insertResult, fieldData]) {
      db.query(Q.getLastCreatedFAQ)
        .then(function([rows, fieldData]) {
          db.query(Q.insertFAQLog, [ rows[0].quesID, req.session.userID, "Created" ])
            .catch((err) => {
              res.end();
              throw err;
            });
            
          res.redirect('/faq');
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
    });
});

router.get('/edit', (req, res) => {
  const ques = req.body.ques;
  const answer = req.body.answer;

  const errors = checkQuesAndAnswer(ques, answer);
  if (errors.length > 0) {
    return res.status(401).json({ errors: errors });
  }

  res.sendFile(path.join(rootDir, 'editfaq.html'));
});

// Helper functions
const checkQuesAndAnswer = function(ques, answer) {
  const errors = [];

  if (ques.length <= 0) {
    errors.push('Question cannot be empty');
  }
  if (answer.length <= 0) {
    errors.push('Answer cannot be empty');
  }

  const regex = /^[A-Za-z]/;
  
  if (!regex.test(ques)) {
    errors.push('Question must start with an alphabetical character (A-Z or a-z)');
  }
  if (!regex.test(answer)) {
    errors.push('Answer must start with an alphabetical character (A-Z or a-z)');
  }

  return errors;
}

module.exports = router;