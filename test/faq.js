const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const db = require('../utils/test-database');

const expect = chai.expect;
const conn = db.connection;
const Q = db.queries;
const baseUrl = 'http://127.0.0.1:' + app.address().port;

chai.use(chaiHttp);

describe('TEST GET FAQ', () => {
  const agent = chai.request.agent(app);
  const testFAQs = [
    { ques: 'Why do we live?', answer: 'To suffer' },
    { ques: 'Where is the nearest hospital?', answer: 'Right here' },
    { ques: 'How are you feeling?', answer: '〒▽〒' }
  ];

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

  afterEach((done) => {
    agent.get('/login/logout')
      .then(() => {
        conn.query(`DELETE FROM faqs`)
          .then(() => done())
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  })

  it ('should get all FAQs from database when logged in as guest user', (done) => {
    agent.post('/login/guest')
      .send({guestID: 'John', password: 'password'})
      .type('form')
      .then((res) => {
        agent.get('/faq/guest')
          .then((err, response) => {
            expect(res).to.have.status(200);

            agent.get('/faq/select')
              .end((err, response) => {
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

  it ('should get all FAQs from database when logged in as admin user', (done) => {
    agent.post('/login/admin')
      .send({adminID: 'Admin', password: 'password'})
      .type('form')
      .then((res) => {
        agent.get('/faq/admin')
          .then((res) => {
            expect(res).to.have.status(200);

            agent.get('/faq/select')
              .end((err, response) => {
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

  it ('should not get any FAQs from database when not logged in as guest user or admin user', (done) => {
    agent.get('/faq/guest')
      .end((err, response) => {
        expect(response).to.redirectTo(baseUrl + '/');
        
        agent.get('/faq/select')
          .end((err, response) => {
            expect(response.body).to.be.empty;
            expect(response).to.redirectTo(baseUrl + '/');
            done();
          });
      });
  });

});