const express = require('express');
var session = require('express-session')
const bodyParser = require('body-parser');
const path = require('path');
const time = require('express-timestamp');

let databasePath = './utils/database';
if (process.env.NODE_ENV === 'test') {
  databasePath = './utils/test-database';
}
const database = require(databasePath);
const rootDir = require('./utils/path');
const loginRoutes = require('./routes/login');
const faqRoutes = require('./routes/faq');



const app = express();
const port = process.env.PORT || 3000;
database.setUpDB();
const db = database.connection;
const Q = database.queries;

app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, 'webfonts')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(time.init);
app.use(session({
  secret: 'I hate it here',
  resave: false,
  saveUninitialized: false,

}));

app.use('/login', loginRoutes);
app.use('/faq', faqRoutes);

// Index Routes
app.get(['/', '/index'], function(req,res) {
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
  } else {
    res.sendFile(path.join(rootDir, 'index.html'));
  }
});

app.get('/home',function(req,res) {
  if (req.session.userID === undefined) {
    return res.redirect('/');
  } 

  res.sendFile(path.join(rootDir, 'home.html'));
});

app.get('/ward',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } 

  res.sendFile(path.join(rootDir, 'ward.html'));
});

app.get('/services',function(req,res) {
  if(req.session.userID === undefined) {
    return res.redirect('/');
  }
  res.sendFile(path.join(rootDir, 'services.html'));
});

app.get('/visit',function(req,res) {
  if(req.session.userID === undefined) {
    return res.redirect('/');
  } 
  res.sendFile(path.join(rootDir, 'visit.html'));
});

app.get('/news',function(req,res) {
  if(req.session.userID === undefined) {
    return res.redirect('/');
  } 
  res.sendFile(path.join(rootDir, 'news.html'));
});

app.get('/contact',function(req,res) {
  if(req.session.userID === undefined) {
    return res.redirect('/');
  }
  res.sendFile(path.join(rootDir, 'contact.html'));
});



module.exports = app.listen(port, ()=>console.log(`Listening on port ${port}`));