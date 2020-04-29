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

router.get('/guest', (req,res)=>{
    if(req.session.userID === undefined) {
        res.redirect(302, '/');
    } else {
        db.query(Q.UserType, [ req.session.userID, 0])
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
    }
});

router.get('/admin', (req,res)=>{
    if(req.session.userID === undefined) {
        res.redirect('/');
    } else {
        db.query(Q.UserType, [ req.session.userID, 1 ])
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
    }
});

router.post('/add', (req,res) =>{
    let question =  req.body.question;
    let answer = req.body.answer;
    
    db.query(Q.insertFAQ, [question, answer])
        .then(function([rows, fieldData]) {
            db.query(Q.insertFAQLOG,[rows['insertId'], req.session.userID, "Created" ] )
            .catch((err) => 
            {
              res.end();
              throw err;
            });
           console.log(rows[0]);
            res.redirect('/faq/admin');
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
});

router.get('/edit', (req,res)=>{
  if(req.session.userID === undefined) {
    res.redirect('/');
} else {
    db.query(Q.UserType, [ req.session.userID, 1 ])
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
}
});
router.get('/select', (req,res)=>{
  if (req.session.userID === undefined) {
    res.redirect('/');
  } else {
    db.query(Q.getFAQs)
        .then(function([rows, fieldData]) {
            console.log(rows);
            db.query(Q.getFAQLOGs).then(function([logrows,fieldData]){
              res.json({faq:rows,faq_log:logrows});
            });
            
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
    }
});

module.exports = router;