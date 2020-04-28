const express = require('express');
var session = require('express-session')
const bodyParser = require('body-parser');
const path = require('path');
const time = require('express-timestamp');

const rootDir = require('./utils/path');
const loginRoutes = require('./routes/login');
const faqRoutes = require('./routes/faq');
const db = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;
db.setUpDB();
const database = db.connection;
const Q = db.queries;

app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, 'webfonts')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(time.init);
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
    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'home.html'));
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

app.get('/homeadmin',function(req,res) {
  if (req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'homeadmin.html'));
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

app.get('/ward',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'ward.html'));
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

app.get('/services',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'services.html'));
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
app.get('/visit',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'visit.html'));
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
app.get('/news',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {

    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'news.html'));
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
app.get('/contact',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 0 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'contact.html'));
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
app.get('/wardadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'wardadmin.html'));
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

app.get('/servicesadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'servicesadmin.html'));
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
app.get('/visitadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'visitadmin.html'));
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
app.get('/newsadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'newsadmin.html'));
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
app.get('/contactadmin',function(req,res) {
  if(req.session.userID === undefined) {
    res.redirect('/');
  } else {
    database.query(Q.UserType, [ req.session.userID, 1 ])
    .then(function([rows, fieldData]) {
      if (rows.length > 0) {
        

        res.sendFile(path.join(rootDir, 'contactadmin.html'));
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



module.exports = app.listen(port, ()=>console.log(`Listening on port ${port}`));