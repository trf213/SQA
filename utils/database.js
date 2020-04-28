const sql = require('mysql2');

const DB_NAME = 'hospitalDB';

const poolConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: DB_NAME,
}

const QUERIES = {
  useDB: `USE ${DB_NAME}`,
  createDB: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
  createTableUsers: 'CREATE TABLE IF NOT EXISTS users (userID VARCHAR(255), password VARCHAR(20) NOT NULL, name VARCHAR(255), child VARCHAR(255), isAdmin BOOL NOT NULL, PRIMARY KEY (userID))',
  createTableFAQs: 'CREATE TABLE IF NOT EXISTS faqs (quesID INT AUTO_INCREMENT, ques VARCHAR(255) NOT NULL, answer MEDIUMTEXT NOT NULL, PRIMARY KEY (quesID))',
  createTableFAQLogs: 'CREATE TABLE IF NOT EXISTS faqs_logs (quesID INT NOT NULL, userID VARCHAR(255) NOT NULL, action MEDIUMTEXT NOT NULL,timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (quesID) REFERENCES faqs(quesID), FOREIGN KEY (userID) REFERENCES users(userID))',
  createTableLogs: 'CREATE TABLE IF NOT EXISTS user_logs (logID INT AUTO_INCREMENT, userID VARCHAR(255) NOT NULL, isLoggedIn BOOL NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (logID), FOREIGN KEY (userID) REFERENCES users(userID))',
  InsertNewUser:`INSERT INTO users (userID, password, name, child, isAdmin) VALUES (?,?,?,?,?)`,
  UpdateGuestUser:`UPDATE users SET  name = ?, child = ? WHERE userID = ?`,
  UpdateLogs:`INSERT INTO user_logs (userID, isloggedIn) values (?,?)`,
  UpdateLog: `UPDATE user_logs SET isloggedIn = false WHERE userID = ?`,
  checkUser: `SELECT * FROM users WHERE userID = ? AND password = ? AND isAdmin = ?`,
  insertFAQ: `INSERT INTO faqs (ques, answer) VALUES (?, ?)`,
  insertFAQLOG: `INSERT INTO faqs_logs (quesID, userID, action) VALUES (?, ?,?)`,
  getFAQs: `SELECT * FROM faqs`,
  getFAQLOGs: `SELECT * FROM faqs_logs`,
  UserType: `SELECT * FROM users where userID = ? and isAdmin = ?`,
  
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

const setUpDB = function(dbName = DB_NAME) {
  return new Promise(function(resolve, reject) {
    const connConfig = {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: '',
    };

    // Create connection to perform DB setup
    const conn = sql.createConnection(connConfig);
    conn.connect(function(err, results) {
      if (err) throw err;

      // Create the DB
      conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function(err, results) {
        if (err) {
          console.error(`Cannot create database ${dbName}`);
          reject(err);
        }

        conn.query(`USE ${dbName}`, function(err, results) {
          if (err) reject(err);
          console.log(`Using ${dbName}`);
              
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
               // Create faqs Logs table
              conn.query(QUERIES.createTableFAQLogs, function(err, results) {
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

  // End promise
  });
}

module.exports = {
  connection: pool.promise(),
  queries: QUERIES,
  setUpDB: setUpDB
};