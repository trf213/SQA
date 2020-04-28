const chai = require('chai');
const chaiHttp = require('chai-http');
const mysql = require('mysql2');

const app = require('../app');
const db = require('../utils/database');
const rootDir = require('../utils/path');

chai.use(chaiHttp);

const expect = chai.expect;
const conn = db.connection;
const Q = db.queries;

describe('TEST GET FAQ', () => {
  before((done) => {
    db.setUpDB('test')
      .then(() => done())
      .catch((err) => {
        throw err;
      });
  });

  after((done) => {
    conn.query(`DROP DATABASE test`)
      .then(() => done())
      .catch((err) => {
        throw err;
      });
  });

});