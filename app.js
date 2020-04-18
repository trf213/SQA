const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = require('./utils/path');
const loginRoutes = require('./routes/login');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, 'webfonts')));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/login', loginRoutes);

// Index Routes
app.get('/',function(req,res) {
    res.sendFile(path.join(rootDir, 'index.html'));
});
app.get('/index',function(req,res) {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/home',function(req,res) {
  res.sendFile(path.join(rootDir, 'home.html'));
});

app.get('/faq',function(req,res) {
    res.sendFile(path.join(rootDir, 'faq.html'));
});

app.get('/faqadmin',function(req,res) {
    res.sendFile(path.join(rootDir, 'faq.html'));
});

app.listen(port, ()=>console.log(`Listening on port ${port}`));