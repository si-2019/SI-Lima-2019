const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const db = require(__dirname + "/db.js");
const Op = Sequelize.Op;

db.sequelize.sync().then(function() {});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/dajSveZahtjeve", async function(req, res) {
  let odgovor = { zahtjevi: [] };
  db.zahtjevZaPotvrdu.findAll().then(async rez => {
    for (let i = 0; i < rez.length; ++i) {
      let rez1 = await db.svrha.findOne({ where: { id: rez[i].idSvrhe } });
      let rez2 = await db.korisnik.findOne({
        where: { id: rez[i].idStudenta }
      });
      let objekat = {
        id: rez[i].id,
        vrsta: rez1.nazivSvrhe,
        datumZahtjeva: rez[i].datumZahtjeva,
        oznacen: false,
        info: {
          idStudenta: rez2.id,
          ime: rez2.ime,
          prezime: rez2.prezime,
          indeks: rez2.indeks
        }
      };
      odgovor.zahtjevi.push(objekat);
    }
    console.log(odgovor);
    res.json(odgovor);
  });
});
app.get("/dajObradjeneZahtjeve", async function(req, res) {
  let odgovor = { zahtjevi: [] };
  db.zahtjevZaPotvrdu.findAll({ where: { obradjen: true } }).then(async rez => {
    for (let i = 0; i < rez.length; ++i) {
      let rez1 = await db.svrha.findOne({ where: { id: rez[i].idSvrhe } });
      let rez2 = await db.korisnik.findOne({
        where: { id: rez[i].idStudenta }
      });
      let objekat = {
        id: rez[i].idZahtjev,
        vrsta: rez1.nazivSvrhe,
        datumZahtjeva: rez[i].datumZahtjeva,
        oznacen: false,
        info: {
          idStudenta: rez2.id,
          ime: rez2.ime,
          prezime: rez2.prezime,
          indeks: rez2.indeks
        }
      };
      odgovor.zahtjevi.push(objekat);
    }
    res.json(odgovor);
  });
});
app.get("/dajNeobradjeneZahtjeve", async function(req, res) {
  let odgovor = { zahtjevi: [] };
  db.zahtjevZaPotvrdu
    .findAll({ where: { obradjen: false } })
    .then(async rez => {
      for (let i = 0; i < rez.length; ++i) {
        let rez1 = await db.svrha.findOne({ where: { id: rez[i].idSvrhe } });
        let rez2 = await db.korisnik.findOne({
          where: { id: rez[i].idStudenta }
        });
        let objekat = {
          id: rez[i].idZahtjev,
          vrsta: rez1.nazivSvrhe,
          datumZahtjeva: rez[i].datumZahtjeva,
          oznacen: false,
          info: {
            idStudenta: rez2.id,
            ime: rez2.ime,
            prezime: rez2.prezime,
            indeks: rez2.indeks
          }
        };
        odgovor.zahtjevi.push(objekat);
      }
      res.json(odgovor);
    });
});
app.post("/obrada", async function(req, res) {
  let ajdi = req.body.zahtjevi;
  await ajdi.forEach(el => {
    db.zahtjevZaPotvrdu.update(
      { obradjen: true, datumObrade: Date.now() },
      { where: { id: el } }
    );
  });

  res.sendStatus(200);
  res.end();
});
app.get("/potvrda/:index/student", async function(req, res) {
  let odgovor = { zahtjevi: [] };
  let ind = req.params.index;
  let student = await db.korisnik.findOne({
    where: { indeks: ind }
  });
  if (student == null) res.json(odgovor);
  else {
    db.zahtjevZaPotvrdu
      .findAll({
        where: { idStudenta: student.id }
      })
      .then(async rez => {
        for (let i = 0; i < rez.length; i++) {
          let rez1 = await db.svrha.findOne({ where: { id: rez[i].idSvrhe } });
          let objekat = {
            id: rez[i].id,
            vrsta: rez1.nazivSvrhe,
            datumZahtjeva: rez[i].datumZahtjeva,
            stanje: rez[i].obradjen,
            datumIzdavanja: rez[i].datumObrade,
            besplatna: rez[i].besplatna,
            info: {
              ime: student.ime,
              prezime: student.prezime
            }
          };
          odgovor.zahtjevi.push(objekat);
        }
        res.json(odgovor);
      });
  }
});

app.get('/svrhe', function(req, res) {
  db.svrha.findAll().then((result) => {
      let jsonNiz=[];
      for(let i=0; i<result.length; i++) {
          let jsonObject={id: result[i].idSvrhe, naziv:result[i].nazivSvrhe};
          jsonNiz.push(jsonObject);
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(jsonNiz));
  });
});

app.get('/brojPodnesenih/:id', function(req, res) {
  let jsonNiz=[];
  db.zahtjev.count({where:{idStudenta:req.params.id}}).then(c => {
      jsonNiz.push({idStudenta:req.params.id, brojPodnesenih: c});
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(jsonNiz));
    });
});

app.listen(31912);
