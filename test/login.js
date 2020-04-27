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

describe('TEST GUEST LOGIN /login/guest', () => {
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

  it ('should login guest user with correct credentials and redirect to security page', (done) => {
    const requestBody = { guestID: 'John', password: 'password' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should fail to login guest user with incorrect credentials and redirect back to guest login page', (done) => {
    const requestBody = { guestID: 'Jake', password: 'p@ssword' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect('Location', '/login/guest');
        expect(response.body).to.have.property('error');
        done();
      })
  });
  
});

describe('TEST ADMIN LOGIN /login/admin', () => {
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

  it ('should login admin user with correct credentials and redirect to security page', (done) => {
    const requestBody = { name: 'Admin', password: 'password' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should fail to login admin user with incorrect credentials and redirect back to admin login page', (done) => {
    const requestBody = { name: 'Karl', password: 'lake' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('error');
        done();
      });
  });
});