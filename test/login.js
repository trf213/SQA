const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const db = require('../utils/test-database');

const port = process.env.PORT || 3000;
const expect = chai.expect;
const conn = db.connection;
const Q = db.queries;

chai.use(chaiHttp);

describe('ECP TEST: User Login [POST /login/guest && POST /login/admin]', () => {
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
            conn.query(Q.dropTableUserLogs)
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

  it ('should fail to login guest user when guest ID is invalid', (done) => {
    const requestBody = { guestID: 'James', password: 'password' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login guest user when password is invalid', (done) => {
    const requestBody = { guestID: 'John', password: 'entering' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });
  
  it ('should fail to login guest user when guest ID and password are invalid', (done) => {
    const requestBody = { guestID: 'James', password: 'entering' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login guest user when no guest ID is provided', (done) => {
    const requestBody = { guestID: '', password: 'entering' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login guest user when no password is provided', (done) => {
    const requestBody = { guestID: 'John', password: '' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login guest user when no guest ID nor password is provided', (done) => {
    const requestBody = { guestID: '', password: '' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should login guest user and redirect to security page when guest ID and password are valid', (done) => {
    const requestBody = { guestID: 'John', password: 'password' };
    chai.request(app).post('/login/guest')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/login/security');
        done();
      });
  });

  it ('should fail to login admin user when admin ID is invalid', (done) => {
    const requestBody = { adminID: 'Patrick', password: 'password' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login admin user when password is invalid', (done) => {
    const requestBody = { adminID: 'Admin', password: 'entering' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login admin user when admin ID and password are invalid', (done) => {
    const requestBody = { adminID: 'Patrick', password: 'entering' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login admin user when no admin ID is provided', (done) => {
    const requestBody = { adminID: '', password: 'entering' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login admin user when no password is provided', (done) => {
    const requestBody = { adminID: 'Admin', password: '' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to login admin user when no admin ID nor password is provided', (done) => {
    const requestBody = { adminID: '', password: '' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should login admin user and redirect to admin homepage when admin ID and password are valid', (done) => {
    const requestBody = { adminID: 'Admin', password: 'password' };
    chai.request(app).post('/login/admin')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/homeadmin');
        done();
      });
  });

});

describe('ECP TEST: Guest Name and Child Name Inputs [POST /login/security]', () => {
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
            conn.query(Q.dropTableUserLogs)
              .then(() => {
                conn.query(Q.dropTableUsers)
                  .then(() => {
                    app.close();
                    done();
                  })
                  .catch((err) => done(err));
              })
              .catch((err) => done(err));
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it ('should fail to pass security when guest name is empty (guestName.length < 1)', (done) => {
    const requestBody = { gname: '', cname: 'Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should pass security when guest name length is nominal (1 <= guestName.length <= 20)', (done) => {
    const requestBody = { gname: 'Sammy', cname: 'Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should fail to pass security when guest name too long (guestName.length >= 20)', (done) => {
    const requestBody = { gname: 'George Georgey Georginton', cname: 'Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when child name is empty (childName.length < 1)', (done) => {
    const requestBody = { gname: 'Jasmine', cname: '' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should pass security when child name length is nominal (1 <= childName.length <= 20)', (done) => {
    const requestBody = { gname: 'Jasmine', cname: 'Katherine' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should fail to pass security when child name too long (childName.length >= 20)', (done) => {
    const requestBody = { gname: 'Jasmine', cname: 'Katherine Trent-Withers' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when guest name and child name are empty (guestName.length < 1 && childName.length < 1)', (done) => {
    const requestBody = { gname: '', cname: '' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when guest name starts with non-alphabetical character', (done) => {
    const requestBody = { gname: '18Jasmine', cname: 'Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when child name starts with non-alphabetical character', (done) => {
    const requestBody = { gname: 'Jasmine', cname: '#Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when guest name and child name start with non-alphabetical character', (done) => {
    const requestBody = { gname: '$Jasmine', cname: '9Garfield' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

});

describe('BVA TEST: Guest Name and Child Name Inputs [POST /login/security]', () => {
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
            conn.query(Q.dropTableUserLogs)
              .then(() => {
                conn.query(Q.dropTableUsers)
                  .then(() => {
                    app.close();
                    done();
                  })
                  .catch((err) => done(err));
              })
              .catch((err) => done(err));
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it ('should fail to pass security when guest name is 0 characters long', (done) => {
    const requestBody = { gname: '', cname: 'Mario Halls' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when guest name is 1 character long', (done) => {
    const requestBody = { gname: 'F', cname: 'Mario Halls' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when guest name is 2 characters long', (done) => {
    const requestBody = { gname: 'Fi', cname: 'Mario Halls' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when guest name is 10 characters long', (done) => {
    const requestBody = { gname: 'Fiona Hall', cname: 'Mario Halls' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when guest name is 19 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls Richard', cname: 'Mario Halls' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when guest name is 20 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls Richards', cname: 'Mario Halls' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should fail to pass security when guest name is 21 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls Richardss', cname: 'Mario Halls' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to pass security when child name is 0 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: '' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when child name is 1 character long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'M' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when child name is 2 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'Ma' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when child name is 10 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'Mario Hall' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when child name is 19 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'Mario Halls Richard' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should pass security and redirect to guest homepage when child name is 20 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'Mario Halls Richards' };

    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(200);
        expect(response.body).to.not.have.property('errors');
        expect(response.redirects[0]).to.contain('/home');
        done();
      });
  });

  it ('should fail to pass security when child name is 21 characters long', (done) => {
    const requestBody = { gname: 'Fiona Halls', cname: 'Mario Halls Richardss' };
    
    agent.post('/login/security')
      .send(requestBody)
      .type('form')
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

});