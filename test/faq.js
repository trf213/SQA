const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const db = require('../utils/database');

const expect = chai.expect;
const conn = db.testConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});
const Q = db.queries;

chai.use(chaiHttp);

describe('TEST GET FAQ', () => {
  const agent = chai.request.agent(app);
  const testFAQs = [
    { ques: 'Why do we live?', answer: 'To suffer' },
    { ques: 'Where is the nearest hospital?', answer: 'Right here' }
  ];

  before((done) => {
    db.setUpDB('test')
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach((done) => {
    for ({ques, answer} of testFAQs) {
      conn.query(Q.insertFAQ, [ ques, answer ])
        .catch((err) => done(err));
    }
    done();
  })

  after((done) => {
    conn.query(`DROP DATABASE test`)
      .then(() => done())
      .catch((err) => done(err));
  });

  afterEach((done) => {
    conn.query(`DELETE FROM faqs`)
      .then(() => done())
      .catch((err) => done(err));
  })

  it ('should get all FAQs from database', (done) => {
    agent.post('/login/guest')
      .send({guestID: 'John', password: 'password'})
      .type('form')
      .then((res) => {
        agent.get('/faq/guest')
          .end((err, response) => {
            expect(response).to.have.status(200);
          });

        agent.get('/faq/select')
          .end((err, response) => {
            const faqs = response.body;
            expect(faqs.length).to.be.above(0);
            expect(faqs.length).to.be.equal(2);
            
            for (let i = 0; i < testFAQs.length; i++) {
              expect(faqs[i].ques).to.be.equal(testFAQs[i].ques);
              expect(faqs[i].answer).to.be.equal(testFAQs[i].answer);
            }
            done();
          });
      });
  });

});