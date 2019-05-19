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
app.get('/Izvjestaji/dajDrugeParcijale/:index/:predmet', async function(req,res){
//console.log("Podao sam ga na lima");
let _indeks = req.params.index;
let predmet = req.params.predmet;

let rezultati = [];
db.korisnik.findOne({where:{indeks:_indeks}}).then(async stu=>{
db.predmet.findOne({where:{naziv:predmet}}).then(
  async pred=>{
    if(pred==null || pred==undefined) res.json({message:"404, nepostojeći predmet"});
    else{
      db.ispit.findAll({where:{idPredmet:pred.id,tipIspita:"Drugi parcijalni"}}).then(
        async ispiti=>{
          let ispiti_id=[];
          for(let i=0;i<ispiti.length;i++) ispiti_id.push(ispiti[i].idIspit); 
          db.ispiti_rezultati.findAll({where:{
            idIspit: {[Op.in]:ispiti_id},
            idStudent: stu.id
          }}).then(konacno=>{
            let odg=[];
            for(let i=0;i<konacno.length;i++)
              odg.push({
                indeks:_indeks,
                ime:stu.ime,
                prezime:stu.prezime,
                datumIspita:ispiti[i].termin,
                brojBodova:konacno[i].bodovi
              });
           res.json(odg);
          });
        }
      );
    }
  }
);
});
});
//app.listen(31912);

app.get('/Izvjestaji/dajPolozeneIspite/:index', function(req,res){
  let _indeks = req.params.index;
  //let predmet = req.params.predmet; 
  //let tekucaGodina = Date.getFullYear();
  
  db.korisnik.findOne({where:{indeks : _indeks}}).then(async student=>{
    if(student == null || student == undefined) res.json({message : "Student s tim indeksom ne postoji!"});
    db.ispiti_rezultati.findAll({where:{idStudent : student.id}, bodovi: {$gt: 9}}).then(async rezultati=>{
      var listaPromisea1 = [];
      for(var i=0; i<rezultati.length; i++) {
        listaPromisea1.push(db.ispit.findOne({where: {idIspit : rezultati[i].idIspit }}));
      }
      var listaPromisea2 = [];
      var tmp;
      Promise.all(listaPromisea1).then(function(ispitiFilter) {
        tmp = ispitiFilter;
        for(var j=0; j<ispitiFilter.length; j++) {
          listaPromisea2.push(db.predmet.findOne({where: {id: ispitiFilter[j].idPredmet}}));
        }

        return Promise.all(listaPromisea2);
      }).then(function(predmeti) {
        var odgovor = [];
        
        for(var k=0; k<predmeti.length; k++) {
          odgovor.push({
            ime: student.ime,
            prezime: student.prezime,
            predmet: predmeti[k].naziv,
            bodovi: rezultati[k].bodovi,
            datum: tmp[k].termin
          });
        }
        res.json(odgovor);
      });
    });
  });
});

app.listen(31912, () => {
  console.log("Server started, listening at port 31912");
});
