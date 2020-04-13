const express = require('express');
const app = express();
var path = require('path');

const port = process.env.PORT || 3000; 

console.log("port");
app.use('/css', express.static('./css'))
app.use('/img', express.static('./img'))
app.use('/js', express.static('./js'))
app.use('/webfonts', express.static('./webfonts'))

//index route 
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
} );
app.get('/index.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
} );
//index route 
app.get('/login.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/login.html'));
} );

app.get('/faq.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/faq.html'));
} );

app.get('/loginadmin.html',function(req,res) {
    res.sendFile(path.join(__dirname + '/loginadmin.html'));
} );

app.listen(port, ()=>console.log(`Listening ${port}`));