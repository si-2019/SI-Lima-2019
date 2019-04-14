// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Svrha", () => {
    describe("GET /svrha", () => {
        it ("treba vratit nesto", (done) => {
            chai.request(app)
                .get('/svrha')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('string')
                    done()
                })
        }) 
    });
});