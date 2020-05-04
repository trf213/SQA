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
})

router.get('/guest', (req,res)=>{
  db.query(Q.userType, [ req.session.userID, 0])
  .then(function([rows, fieldData]) {
    if (rows.length > 0) {
      res.sendFile(path.join(rootDir, 'faq.html'));
    } else {
      res.redirect('/homeadmin');
    }
  })
  .catch(function(err) {
    res.end();
    throw err;
  });
});

router.get('/admin', (req,res)=>{
  db.query(Q.userType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'faqadmin.html'));
      } else {
        res.redirect('/home');
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });
});

router.post('/add', (req,res) =>{
  let question = req.body.question;
  let answer = req.body.answer;
  
  db.query(Q.insertFAQ, [question, answer])
    .then(function([insertResult, fieldData]) {
      db.query(Q.getLastCreatedFAQ)
        .then(function([rows, fieldData]) {
          db.query(Q.insertFAQLog, [ rows[0].quesID, req.session.userID, "Created" ])
            .catch((err) => {
              res.end();
              throw err;
            });
            
          res.redirect('/faq/admin');
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
    });
});

router.get('/edit', (req,res)=>{
  db.query(Q.userType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
    
        

        res.sendFile(path.join(rootDir, 'editfaq.html'));
      } else {
        res.redirect('/home');
      }
    })
    .catch(function(err) {
      res.end();
      throw err;
    });

});
router.get('/select', (req,res)=>{
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

module.exports = router;