const express = require('express');
const sql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; 

const dbName = 'hospitalDB';
const conConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
};
const queries = {
  useDB: `USE ${dbName}`,
  createDB: `CREATE DATABASE ${dbName}`,
  createTableUsers: 'CREATE TABLE users (userID VARCHAR(255), password VARCHAR(20) NOT NULL, name VARCHAR(255), child VARCHAR(255), isAdmin BOOL NOT NULL, PRIMARY KEY (userID))',
  createTableFAQs: 'CREATE TABLE faqs (quesID VARCHAR(255), ques VARCHAR(255) NOT NULL, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableLogs: 'CREATE TABLE user_logs (logID int AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))'
}

let conn = sql.createConnection(conConfig);

// Connect to MySQL Server
conn.connect(function(err) {
  if (err) throw err;
  console.log('Connected to SQL server');
});

// Switch to DB
conn.query(queries.useDB, function(err, result) {
  if (err) {
    // Create the DB
    conn.query(queries.createDB, function (err, result) {
      if (err) throw err;
      console.log('Database created');
    });

    conn.query(queries.useDB, function(err, result) {
      if (err) throw err;
    });

    // Check if users table exists
    conn.query('SELECT * FROM users LIMIT 1', function(err, result) {

      if (err) {
        // Create users table
        conn.query(queries.createTableUsers, function(err, result) {
          if (err) throw err;
          console.log('Users table created');

          // Create logs table
          conn.query(queries.createTableLogs, function(err, result) {
            if (err) throw err;
            console.log('Logs table created');
          });
        });
      }

    });

    // Check if faqs table exists
    conn.query('SELECT * FROM faqs LIMIT 1', function(err, result) {
      
      if (err) {
        // Create faqs table
        conn.query(queries.createTableFAQs, function(err, result) {
          if (err) throw err;
          console.log('FAQs table created');
        });
      }

    });
  }
  console.log(`Using ${dbName}`);

});



app.use('/css', express.static('./css'))
app.use('/img', express.static('./img'))
app.use('/js', express.static('./js'))
app.use('/webfonts', express.static('./webfonts'))
app.use(bodyParser.urlencoded({extended: false}))

// Index Routes
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/index',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


// Login Routes
app.get('/login/guest',function(req,res) {
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/login/admin',function(req,res) {
  res.sendFile(path.join(__dirname + '/loginadmin.html'));
});

app.post('/login/guest', (req, res) => {
  const guestID = req.body.guestID;
  const password = req.body.password;

  conn.query("SELECT * FROM users WHERE guestID = ?")
});


app.get('/home',function(req,res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/faq',function(req,res) {
    res.sendFile(path.join(__dirname + '/faq.html'));
});

app.get('/faqadmin',function(req,res) {
    res.sendFile(path.join(__dirname + '/faq.html'));
});

app.listen(port, ()=>console.log(`Listening on port ${port}`));