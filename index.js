const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const db = require(__dirname + "/db.js");
const Op = Sequelize.Op;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 31912;

db.sequelize
  .sync({ force: false }) // NE MIJENJAJ NA TRUE NIKAD
  .then(() => {
    //force:true je da se nas dio baze uvijek iznova kreira
    console.log("Konektovan na bazu!");
  })
  .catch(e => {
    console.log("Greska");
    console.log(e);
  });

app.post("/slanjeZahtjevaZaPotvrdu", upload.any(), function(req, res) {
  var bodyReq = JSON.parse(req.body.state);

  var obradjenZahtjev = false;
  var datumObradeZahtjeva = null;
  var besplatnaPotvrda = true;
  var datumSlanjaZahtjeva = Date.now();

  db.zahtjevZaPotvrdu.findOrCreate({
    where: {
      idStudenta: bodyReq.idStudenta,
      idSvrhe: bodyReq.idSvrhe,
      idAkademskeGodine: bodyReq.idAkademskeGodine,
      obradjen: obradjenZahtjev,
      datumZahtjeva: datumSlanjaZahtjeva,
      datumObrade: datumObradeZahtjeva,
      besplatna: besplatnaPotvrda
    }
  }).catch(err => res.send(err));
});

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
    db.zahtjevZaPotvrdu
      .update(
        { obradjen: true, datumObrade: Date.now() },
        { where: { id: el} }
      )
      
  })

    res.sendStatus(200);
    res.end();
 
});
app.listen(PORT,function(){ console.log('server successfully started on port '+PORT); });
// app.listen(8080);
