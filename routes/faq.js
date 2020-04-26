const express = require('express');
const path = require('path');

const database = require('../utils/database');
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

const querystring = require('querystring');

router.get('/guest', (req,res)=>{
    res.sendFile(path.join(rootDir, 'faq.html'));
});

router.get('/admin', (req,res)=>{
    res.sendFile(path.join(rootDir, 'faqadmin.html'));
});


router.post('/add', (req,res) =>{
    let question =  req.body.question;
    let answer = req.body.answer;
    
    db.query(Q.Insertfaq, [0, question, answer], function(err, result) {
        if (err) throw err;
        console.log(result);
       
        
        
        res.redirect('/faq/admin');
      });
   
   
});

router.get('/select', (req,res)=>{
    db.query(Q.Checkfaq, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result );
        
        
      
      });
    
});
module.exports = router;