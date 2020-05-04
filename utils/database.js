const sql = require('mysql2');

const DB_NAME = 'hospitalDB';

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
  createTableFAQs: 'CREATE TABLE IF NOT EXISTS faqs (quesID INT AUTO_INCREMENT, ques VARCHAR(255) NOT NULL UNIQUE, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableFAQLogs: 'CREATE TABLE IF NOT EXISTS faq_logs (quesID INT NOT NULL, userID VARCHAR(255) NOT NULL, action VARCHAR(255) NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (quesID) REFERENCES faqs(quesID), FOREIGN KEY (userID) REFERENCES users(userID))',
  createTableUserLogs: 'CREATE TABLE IF NOT EXISTS user_logs (logID INT AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))',
  insertNewUser:`INSERT INTO users (userID, password, name, child, isAdmin) VALUES (?,?,?,?,?)`,
  updateGuestUser:`UPDATE users SET name = ?, child = ? WHERE userID = ?`,
  insertNewUserLog:`INSERT INTO user_logs (userID, isloggedIn) values (?,?)`,
  updateUserLog: `UPDATE user_logs SET isloggedIn = false WHERE userID = ?`,
  checkUser: `SELECT * FROM users WHERE userID = ? AND password = ? AND isAdmin = ?`,
  insertFAQ: `INSERT INTO faqs (ques, answer) VALUES (?, ?)`,
  insertFAQLog: `INSERT INTO faq_logs (quesID, userID, action) VALUES (?, ?,?)`,
  getUserByID: `SELECT * FROM users where userID = ?`,
  getLastCreatedFAQ: `SELECT * FROM faqs ORDER BY quesID DESC LIMIT 1`,
  getOneFAQ: `SELECT * FROM faqs WHERE ques = ? AND answer = ?`,
  getFAQs: `SELECT * FROM faqs`,
  getFAQLogs: `SELECT * FROM faq_logs`,
  getMostRecentFAQLogs: `SELECT * FROM (SELECT * FROM faq_logs GROUP BY quesID ORDER BY quesID DESC) as recentLogs order by quesID`,
  userType: `SELECT * FROM users where userID = ? AND isAdmin = ?`,
  clearTableUsers: 'DELETE FROM users',
  clearTableFAQs: 'DELETE FROM faqs',
  clearTableFAQLogs: 'DELETE FROM faq_logs',
  clearTableUserLogs: 'DELETE FROM user_logs',
  dropTableUsers: 'DROP TABLE users',
  dropTableUserLogs: 'DROP TABLE user_logs',
  dropTableFAQs: 'DROP TABLE faqs',
  dropTableFAQLogs: 'DROP TABLE faq_logs'
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
      // conn.destroy();
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
            conn.query(QUERIES.createTableUserLogs, function(err, results) {
              if (err) {
                console.log('Cannot create User Logs table');
                reject(err);
              }
        
              // Create faqs table
              conn.query(QUERIES.createTableFAQs, function(err, results) {
                if (err) {
                  console.log('Cannot create FAQs table');
                  reject(err);
                }

               // Create faqs Logs table
                conn.query(QUERIES.createTableFAQLogs, function(err, results) {
                  if (err) {
                    console.log('Cannot create FAQ Logs table');
                    reject(err);
                  }
                  
                  resolve();
                });
              });
            });
    
            // Create one admin and guest user for testing
            conn.query(QUERIES.insertNewUser, [ 'John', 'password', null, null, false ], function(err, results) {
              if (err) {
                if (err.code !== 'ER_DUP_ENTRY') {
                  reject(err);
                }
              }
            });
            conn.query(QUERIES.insertNewUser, [ 'Admin', 'password', null, null, true ], function(err, results) {
              if (err) {
                if (err.code !== 'ER_DUP_ENTRY') {
                  reject(err);
                }
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