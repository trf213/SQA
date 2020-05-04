const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const db = require('../utils/test-database');

const port = process.env.PORT || 3000;
const expect = chai.expect;
const conn = db.connection;
const Q = db.queries;

chai.use(chaiHttp);

describe('TEST USER LOGIN [POST /login/guest && POST /login/admin]', () => {
  before((done) => {
    db.setUpDB()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn.query(Q.dropTableFAQLogs)
      .then(() => {
        conn.query(Q.dropTableFAQs)
          .then(() => {
            conn.query(Q.dropTableLogs)
              .then(() => {
                conn.query(Q.dropTableUsers)
                  .then(() => done())
                  .catch((err) => done(err));
              })
              .catch((err) => done(err));
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
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
        expect(response.body).to.have.property('errors');
        done();
      })
  });

  it ('should login admin user with correct credentials and redirect to security page', (done) => {
    const requestBody = { adminID: 'Admin', password: 'password' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should fail to login admin user with incorrect credentials and redirect back to admin login page', (done) => {
    const requestBody = { adminID: 'Karl', password: 'lake' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

});

describe('TEST GUEST NAME AND CHILD NAME INPUTS [POST /login/security]', () => {
  const agent = chai.request.agent(app);
  const loginInfo = { guestID: 'John', password: 'password' };

  before((done) => {
    app.listen(port);
    db.setUpDB()
      .then(() => {
        agent.post('/login/guest')
          .send(loginInfo)
          .type('form')
          .then(() => done())
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  after((done) => {
    conn.query(Q.dropTableFAQLogs)
      .then(() => {
        conn.query(Q.dropTableFAQs)
          .then(() => {
            conn.query(Q.dropTableLogs)
              .then(() => {
                conn.query(Q.dropTableUsers)
                  .then(() => done())
                  .catch((err) => done(err));
              })
              .catch((err) => done(err));
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it ('should fail to save guest information when guest name or child name is empty', (done) => {
    const requestBody = { gname: '', cname: '' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        const responseBody = response.body;
        expect(response).to.have.status(401);
        expect(responseBody).to.have.property('errors');
        expect(responseBody.errors.length).to.be.equal(2);
        done();
      });
  });

  it ('should save guest information and redirect to home page when guest name and child name are 1 character long', (done) => {
    const requestBody = { gname: 'J', cname: 'C' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should save guest information and redirect to home page when guest name and child name are 2 characters long', (done) => {
    const requestBody = { gname: 'Jo', cname: 'Ce' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should save guest information and redirect to home page when guest name and child name are 10 characters long', (done) => {
    const requestBody = { gname: 'John Brown', cname: 'Cena Brown' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should save guest information and redirect to home page when guest name and child name are 19 characters long', (done) => {
    const requestBody = { gname: 'John Brown Hamilton', cname: 'Cena Brown Hamilton' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should save guest information and redirect to home page when guest name and child name are 20 characters long', (done) => {
    const requestBody = { gname: 'John Brown Hamiltons', cname: 'Cena Brown Hamiltons' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it ('should fail to save guest information when guest name or child name is more than 20 characters long', (done) => {
    const requestBody = { gname: 'John Brown Hamiltons Jr.', cname: 'Cena Brown Hamiltons Jr.' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        const responseBody = response.body;
        expect(response).to.have.status(401);
        expect(responseBody).to.have.property('errors');
        expect(responseBody.errors.length).to.be.equal(2);
        done();
      });
  });

});