const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const find = require("find");
const path = require("path");

chai.use(chaiHttp);
var should = chai.should();
var expect = chai.expect;
const BAZ_URL = "http://localhost:8080";
describe("Testira dajSveZahtjeve, treba vratiti JSON", function(done) {
  it("Salje zahtjev na /dajSveZahtjeve ... ", function(done) {
    chai
      .request(BAZ_URL)
      .get(`/dajSveZahtjeve`)
      .end(function(err, res) {
        assert.equal(err, null, "Greska, nije stigao odgovor od servera!");
        res.should.have.header("Content-Type", /application\/json/);
        done();
      });
  });
});
describe("Testira dajObradjeneZahtjeve, treba vratiti JSON", function(done) {
  it("Salje zahtjev na /dajObradjeneZahtjeve ...", function(done) {
    chai
      .request(BAZ_URL)
      .get(`/dajObradjeneZahtjeve`)
      .end(function(err, res) {
        assert.equal(err, null, "Greska, nije stigao odgovor od servera!");
        res.should.have.header("Content-Type", /application\/json/);
        done();
      });
  });
});
describe("Testira dajNeobradjeneZahtjeve, treba vratiti JSON", function(done) {
  it("Salje zahtjev na /dajNeobradjeneZahtjeve ...", function(done) {
    chai
      .request(BAZ_URL)
      .get(`/dajNeobradjeneZahtjeve`)
      .end(function(err, res) {
        assert.equal(err, null, "Greska, nije stigao odgovor od servera!");
        res.should.have.header("Content-Type", /application\/json/);
        done();
      });
  });
});

describe("Testira obradi", function(done) {
  it("Salje zahtjev na /obrada", function(done) {
    chai
      .request(BAZ_URL)
      .post("/obrada")
      .send({ zahtjevi: ["2"] })
      .end(function(err, res) {
        assert.equal(err, null, "Greska, nije stigao odgovor od servera!");
        done();
      });
  });
});
describe("Testira potvrda/:index/student", function(done) {
  it("Salje zahtjev na potvrda/:index/student", function(done) {
    chai
      .request(BAZ_URL)
      .get(`/potvrda/17555/student`)
      .end(function(err, res) {
        assert.equal(err, null, "Greska, nije stigao odgovor od servera!");
        res.should.have.header("Content-Type", /application\/json/);
        done();
      });
  });
});
