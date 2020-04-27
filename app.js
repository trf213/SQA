const express = require('express');
var session = require('express-session')
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = require('./utils/path');
const loginRoutes = require('./routes/login');
const faqRoutes = require('./routes/faq');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, 'webfonts')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'I hate it here',
  resave: false,
  saveUninitialized: false,

}));

app.use('/login', loginRoutes);
app.use('/faq', faqRoutes);

// Index Routes
app.get('/',function(req,res) {
    res.sendFile(path.join(rootDir, 'index.html'));
});
app.get('/index',function(req,res) {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/home',function(req,res) {
  if (req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'home.html'));
  }
});

app.get('/homeadmin',function(req,res) {
  if (req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'homeadmin.html'));
  }
});

app.get('/ward',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'ward.html'));
  }
});

app.get('/services',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'services.html'));
  }
});
app.get('/visit',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'visit.html'));
  }
});
app.get('/news',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'news.html'));
  }
});
app.get('/contact',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'contact.html'));
  }
});
app.get('/wardadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'wardadmin.html'));
  }
});

app.get('/servicesadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'servicesadmin.html'));
  }
});
app.get('/visitadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'visitadmin.html'));
  }
});
app.get('/newsadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'newsadmin.html'));
  }
});
app.get('/contactadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(rootDir, 'contactadmin.html'));
  }
});



app.listen(port, ()=>console.log(`Listening on port ${port}`));