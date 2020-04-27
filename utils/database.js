const sql = require('mysql2');

const DB_NAME = 'hospitalDB';

const connConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
};

const poolConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: DB_NAME,
}

const QUERIES = {
  useDB: `USE ${DB_NAME}`,
  createDB: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
  createTableUsers: 'CREATE TABLE IF NOT EXISTS users (userID VARCHAR(255), password VARCHAR(20) NOT NULL, name VARCHAR(255), child VARCHAR(255), isAdmin BOOL NOT NULL, PRIMARY KEY (userID))',
  createTableFAQs: 'CREATE TABLE IF NOT EXISTS faqs (quesID INT AUTO_INCREMENT, ques VARCHAR(255) NOT NULL, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableLogs: 'CREATE TABLE IF NOT EXISTS user_logs (logID INT AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))',
  InsertNewUser:`INSERT INTO users (userID, password, name, child, isAdmin) VALUES (?,?,?,?,?)`,
  UpdateGuestUser:`UPDATE users SET  name = ?, child = ? WHERE userID = ?`,
  checkUser: `SELECT * FROM users WHERE userID = ? AND password = ? AND isAdmin = ?`,
  insertFAQ: `INSERT INTO faqs (ques, answer) VALUES (?, ?)`,
  getFAQs: `SELECT * FROM faqs`
}

// Create SQL connection pool
const pool = sql.createPool(poolConfig);
pool.on('connect', function() {
  console.log('Connected to SQL server');
});
pool.on('error', function(err) {
  console.error('Something went wrong with SQL server');
  throw err;
});

// Create connection to perform DB setup
const conn = sql.createConnection(connConfig);
conn.on('connect', function() {
  console.log('Connected to SQL server');
});
conn.on('error', function(err) {
  console.error('Something went wrong with SQL server');
  throw err;
});

// Switch to DB
conn.query(QUERIES.useDB, function(err, results) {
  if (err) {
    // Create the DB
    conn.query(QUERIES.createDB, function (err, results) {
      if (err) {
        console.error(`Cannot create database ${DB_NAME}`);
        throw err;
      }
      console.log('Database created');
    });

    conn.query(QUERIES.useDB, function(err, results) {
      if (err) throw err;
    });

    // Check if users table exists
    conn.query('SELECT * FROM users LIMIT 1', function(err, results) {

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

          // Create one admin and guest user for testing
          conn.query(QUERIES.InsertNewUser, [ 'John', 'password', null, null, false ], function(err, results) {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                console.log('Guest user already exists');
              } else throw err;
            }
          });
          conn.query(QUERIES.InsertNewUser, [ 'Admin', 'password', null, null, true ], function(err, results) {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                console.log('Admin user already exists');
              } else throw err;
            }
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
  connection: pool.promise(),
  queries: QUERIES
};