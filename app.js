const express = require('express');
const sql = require('mysql');
const app = express();
var path = require('path');

const port = process.env.PORT || 3000; 


var con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE hospitalDB", function (err, result) {
        // if (err) throw err;
        console.log("Database created");
      });

      
  });


 


console.log(port);
app.use('/css', express.static('./css'))
app.use('/img', express.static('./img'))
app.use('/js', express.static('./js'))
app.use('/webfonts', express.static('./webfonts'))

// Index Routes
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
} );
app.get('/index.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
} );

app.get('/home',function(req,res) {
    res.sendFile(path.join(__dirname + '/home.html'));
} );
app.get('/login.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/login.html'));
} );

app.get('/faq.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/faq.html'));
} );

app.get('/faqadmin.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/faq.html'));
} );

app.get('/loginadmin.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/loginadmin.html'));
} );

app.listen(port, ()=>console.log(`Listening ${port}`));