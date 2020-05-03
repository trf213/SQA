const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const db = require('../utils/test-database');

const port = process.env.PORT || 3000;
const expect = chai.expect;
const conn = db.connection;
const Q = db.queries;

chai.use(chaiHttp);
const agent = chai.request.agent(app);

const testFAQs = [
  { ques: 'Why do we live?', answer: 'To suffer' },
  { ques: 'Where is the nearest hospital?', answer: 'Right here' },
  { ques: 'How are you feeling?', answer: 'Not great to be honest' },
  { ques: 'What can I do to make myself comfortable', answer: 'Bring some headphones and wait patiently in the waiting room' }
];

describe('PAGE TEST: View FAQs [GET /faq/guest && GET /faq/admin]', () => {
  before((done) => {
    db.setUpDB()
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach((done) => {
    // var promises = [];
    // for ({ques, answer} of testFAQs) {
    //   promises.push(conn.query(Q.insertFAQ, [ ques, answer ]));
    // }
    
    // Promise.all(promises).then(done());

    // Enter into DB via promise chain
    let chain = Promise.resolve();

    for (let i = 0; i < testFAQs.length; i++) {
      chain = chain.then(function() {
        return conn.query(Q.insertFAQ, [ testFAQs[i].ques, testFAQs[i].answer ]);
      });
    }
    chain.then(() => done());
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

  afterEach((done) => {
    conn.query(Q.clearTableFAQLogs)
      .then(() => conn.query(Q.clearTableFAQs))
        .then(() => done())
        .catch((err) => done(err))
      .catch((err) => done(err));
  });

  it ('should get all FAQs from database when logged in as guest user', (done) => {
    const loginInfo = { guestID: 'John', password: 'password' };
    const securityInfo = { gname: 'John', cname: 'Cena' };

    agent.post('/login/guest')
      .send(loginInfo)
      .type('form')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.contain('/login/security');
        
        agent.post('/login/security')
          .send(securityInfo)
          .type('form')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.redirects[0]).to.contain('/home');
            
            // Go to the FAQ page
            agent.get('/faq/guest')
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.have.property('errors');
        
                // Get the FAQs from the database
                agent.get('/faq/select')
                  .end((err, response) => {
                    if (err) done(err);

                    expect(response).to.have.status(200);
                    expect(response.body).to.not.have.property('errors');
                    expect(response.body).to.have.property('faq');
                    expect(response.body).to.have.property('faq_log');
        
                    const faqs = response.body.faq;
                    expect(faqs.length).to.be.above(0);
                    expect(faqs.length).to.be.equal(testFAQs.length);
                    
                    for (let i = 0; i < testFAQs.length; i++) {
                      expect(faqs[i].ques).to.be.equal(testFAQs[i].ques);
                      expect(faqs[i].answer).to.be.equal(testFAQs[i].answer);
                    }
                    done();
                  });
              });            
          });
      });
  });

  it ('should get all FAQs from database when logged in as admin user', (done) => {
    agent.post('/login/admin')
      .send({adminID: 'Admin', password: 'password'})
      .type('form')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.redirects[0]).to.contain('/homeadmin');

        // Go to the FAQ page
        agent.get('/faq/admin')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.not.have.property('errors');

            agent.get('/faq/select')
              .end((err, response) => {
                if (err) done(err);

                expect(response).to.have.status(200);
                expect(response.body).to.not.have.property('errors');
                expect(response.body).to.have.property('faq');
                expect(response.body).to.have.property('faq_log');
    
                const faqs = response.body.faq;
                expect(faqs.length).to.be.above(0);
                expect(faqs.length).to.be.equal(testFAQs.length);
                
                for (let i = 0; i < testFAQs.length; i++) {
                  expect(faqs[i].ques).to.be.equal(testFAQs[i].ques);
                  expect(faqs[i].answer).to.be.equal(testFAQs[i].answer);
                }
                done();
              });
          });
      });
  });

});

describe('ECP TEST: Creating and Edit FAQs [POST /faq/add && /faq/edit]', () => {
  const loginInfo = {adminID: 'Admin', password: 'password' }
  before((done) => {
    app.listen(port);
    db.setUpDB()
      .then(() => {
        agent.post('/login/admin')
          .send(loginInfo)
          .type('form')
          .then(() => done())
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  beforeEach((done) => {
    // var promises = [];
    // for ({ques, answer} of testFAQs) {
    //   promises.push(conn.query(Q.insertFAQ, [ ques, answer ]));
    // }
    
    // Promise.all(promises).then(done());

    // Enter into DB via promise chain
    let chain = Promise.resolve();

    for (let i = 0; i < testFAQs.length; i++) {
      chain = chain.then(function() {
        return conn.query(Q.insertFAQ, [ testFAQs[i].ques, testFAQs[i].answer ]);
      });
    }
    chain.then(() => done());
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

  afterEach((done) => {
    conn.query(Q.clearTableFAQLogs)
      .then(() => conn.query(Q.clearTableFAQs))
        .then(() => done())
        .catch((err) => done(err))
      .catch((err) => done(err));
  });

  it ('should fail to create a new FAQ when question is empty (ques.length < 1)', (done) => {
    const requestBody = { ques: '', answer: 'What was the question again?' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to create a new FAQ when answer is empty (answer.length < 1)', (done) => {
    const requestBody = { ques: 'How do I find my way around the hospital?', answer: '' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to create a new FAQ when question and answer are empty (answer.length < 1)', (done) => {
    const requestBody = { ques: '', answer: '' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to create a new FAQ when question starts with non-alphabetical character', (done) => {
    const requestBody = { ques: '124How do I find my way around the hospital?', answer: 'I am not sure' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to create a new FAQ when answer starts with non-alphabetical character', (done) => {
    const requestBody = { ques: 'How do I find my way around the hospital?', answer: '&I am not sure' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should fail to create a new FAQ when question and answer start with non-alphabetical character', (done) => {
    const requestBody = { ques: '~How do I find my way around the hospital?', answer: '!$I am not sure' };
    
    agent.post('/faq/add')
      .send(requestBody)
      .end((err, response) => {
        if (err) done(err);

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('errors');
        done();
      });
  });

  it ('should create a new FAQ when question and answer are both not empty (ques.length >= 1 && answer.length >= 1)', (done) => {
    const requestBody = { 
      ques: 'How do I find my way around the hospital?', 
      answer: 'You can find a map of the hospital on the wards page 🙂' 
    };
    
    agent.post('/faq/add')
      .send(requestBody)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.not.have.property('errors');

        agent.get('/faq/select')
          .end((err, response) => {
            if (err) done(err);
            
            expect(response).to.have.status(200);
            expect(response.body).to.not.have.property('errors');
            expect(response.body).to.have.property('faq');
            expect(response.body).to.have.property('faq_log');

            const faqs = response.body.faq;
            expect(faqs.length).to.be.above(0);
            expect(faqs.length).to.be.equal(testFAQs.length + 1);

            testFAQs.push(requestBody);
            for (let i = 0; i < testFAQs.length; i++) {
              expect(faqs[i].ques).to.be.equal(testFAQs[i].ques);
              expect(faqs[i].answer).to.be.equal(testFAQs[i].answer);
            }
            testFAQs.pop();

            done();
          });
      })
      .catch((err) => done(err));
  });
});