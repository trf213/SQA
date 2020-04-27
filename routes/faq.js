const express = require('express');
const path = require('path');

const database = require('../utils/database');
const rootDir = require('../utils/path');

const router = express.Router();
const db = database.connection;
const Q = database.queries;

router.get('/guest', (req,res)=>{
    if(req.session.userID === undefined) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(rootDir, 'faq.html'));
    }
});

router.get('/admin', (req,res)=>{
    if(req.session.userID === undefined) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(rootDir, 'faqadmin.html'));
    }
});

router.post('/add', (req,res) =>{
    let question =  req.body.question;
    let answer = req.body.answer;
    
    db.query(Q.insertFAQ, [question, answer])
        .then(function([rows, fieldData]) {
            console.log(rows);
            res.redirect('/faq/admin');
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
});

router.get('/select', (req,res)=>{
    db.query(Q.getFAQs)
        .then(function([rows, fieldData]) {
            console.log(rows);
            res.send(rows);
        })
        .catch(function(err) {
            res.end();
            throw err;
        });
});

module.exports = router;