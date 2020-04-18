const sql = require('mysql2');

const DB_NAME = 'hospitalDB';

const connConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: '',
};

const QUERIES = {
  useDB: `USE ${DB_NAME}`,
  createDB: `CREATE DATABASE ${DB_NAME}`,
  createTableUsers: 'CREATE TABLE users (userID VARCHAR(255), password VARCHAR(20) NOT NULL, name VARCHAR(255), child VARCHAR(255), isAdmin BOOL NOT NULL, PRIMARY KEY (userID))',
  createTableFAQs: 'CREATE TABLE faqs (quesID VARCHAR(255), ques VARCHAR(255) NOT NULL, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableLogs: 'CREATE TABLE user_logs (logID int AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))',
  InsertNewUser:`INSERT INTO users (userID, password, name, child, isAdmin) VALUES (?,?,?,?,?)`,
  UpdateGuestUser:`UPDATE users SET  name = ?, child = ? WHERE userID = ?`,
  checkUser: `SELECT * FROM users WHERE userID = ? AND password = ? AND isAdmin = ?`
}

const conn = sql.createConnection(connConfig);
console.log('Connected to SQL server');

// Switch to DB
conn.query(QUERIES.useDB, function(err, results) {
  if (err) {
    // Create the DB
    conn.query(QUERIES.createDB, function (err, results) {
      if (err) throw err;
      console.log('Database created');
    });

    conn.query(QUERIES.useDB, function(err, results) {
      if (err) throw err;
    });

    // Check if users table exists
    conn.query('SELECT * FROM users LIMIT 1', function(err, resuls) {

      if (err) {
        // Create users table
        conn.query(QUERIES.createTableUsers, function(err, results) {
          if (err) throw err;
          console.log('Users table created');

          // Create logs table
          conn.query(QUERIES.createTableLogs, function(err, results) {
            if (err) throw err;
            console.log('Logs table created');
          });
        });
      }

    });

    // Check if faqs table exists
    conn.query('SELECT * FROM faqs LIMIT 1', function(err, results) {
      
      if (err) {
        // Create faqs table
        conn.query(QUERIES.createTableFAQs, function(err, results) {
          if (err) throw err;
          console.log('FAQs table created');
        });
      }

    });
  }
  console.log(`Using ${DB_NAME}`);
  
});

module.exports = {
  connection: conn,
  queries: QUERIES
};