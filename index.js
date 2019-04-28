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
app.listen(8080);
