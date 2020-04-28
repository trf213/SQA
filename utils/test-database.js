const sql = require('mysql2');

const DB_NAME = 'testDB';

const poolConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: DB_NAME,
}

const QUERIES = {
  useDB: `USE ${DB_NAME}`,
  createDB: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
  dropDB: `DROP DATABASE ${DB_NAME}`,
  createTableUsers: 'CREATE TABLE IF NOT EXISTS users (userID VARCHAR(255), password VARCHAR(20) NOT NULL, name VARCHAR(255), child VARCHAR(255), isAdmin BOOL NOT NULL, PRIMARY KEY (userID))',
  createTableFAQs: 'CREATE TABLE IF NOT EXISTS faqs (quesID INT AUTO_INCREMENT, ques VARCHAR(255) NOT NULL, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableLogs: 'CREATE TABLE IF NOT EXISTS user_logs (logID INT AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))',
  InsertNewUser:`INSERT INTO users (userID, password, name, child, isAdmin) VALUES (?,?,?,?,?)`,
  UpdateGuestUser:`UPDATE users SET  name = ?, child = ? WHERE userID = ?`,
  UpdateLogs:`INSERT INTO user_logs (userID, isloggedIn) values (?,?)`,
  UpdateLog: `UPDATE user_logs SET isloggedIn = false WHERE userID = ?`,
  checkUser: `SELECT * FROM users WHERE userID = ? AND password = ? AND isAdmin = ?`,
  insertFAQ: `INSERT INTO faqs (ques, answer) VALUES (?, ?)`,
  getFAQs: `SELECT * FROM faqs`,
  UserType: `SELECT * FROM users where userID = ? and isAdmin = ?`,
  dropTableUsers: 'DROP TABLE users',
  dropTableLogs: 'DROP TABLE user_logs',
  dropTableFAQs: 'DROP TABLE faqs'
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

const setUpDB = function() {
  return new Promise((resolve, reject) => {
    const connConfig = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: '',
    };

    // Create connection to perform DB setup
    const conn = sql.createConnection(connConfig)
    conn.on('error', (err) => {
      conn.destroy();
      throw err;
    });

    conn.connect(function(err, results) {
      if (err) reject(err);
    
      // Create the DB
      conn.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, function(err, results) {
        if (err) {
          console.error(`Cannot create database ${DB_NAME}`);
          reject(err);
        }
    
        conn.query(`USE ${DB_NAME}`, function(err, results) {
          if (err) reject(err);
          console.log(`Using ${DB_NAME}`);
              
          // Create users table
          conn.query(QUERIES.createTableUsers, function(err, results) {
            if (err) {
              console.log('Cannot create Users table');
              reject(err);
            }
    
            // Create logs table
            conn.query(QUERIES.createTableLogs, function(err, results) {
              if (err) {
                console.log('Cannot create Logs table');
                reject(err);
              }
        
              // Create faqs table
              conn.query(QUERIES.createTableFAQs, function(err, results) {
                if (err) {
                  console.log('Cannot create FAQs table');
                  reject(err);
                }

                resolve();
              });
            });
    
            // Create one admin and guest user for testing
            conn.query(QUERIES.InsertNewUser, [ 'John', 'password', null, null, false ], function(err, results) {
              if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.log('Guest user already exists');
                } else reject(err);
              }
            });
            conn.query(QUERIES.InsertNewUser, [ 'Admin', 'password', null, null, true ], function(err, results) {
              if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.log('Admin user already exists');
                } else reject(err);
              }
            });
          });
        });
      });
    });

  // End Promise
  });
}


module.exports = {
  connection: pool.promise(),
  queries: QUERIES,
  setUpDB: setUpDB
};