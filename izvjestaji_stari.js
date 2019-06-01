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
app.get('/Izvjestaji/dajNepolozenePredmete/:index', async function(req,res){
  let _indeks = req.params.index;
db.korisnik.findOne({where:{indeks:_indeks}}).then(
  async stu=>{
    db.ispiti_rezultati.findAll({where:{idStudent:stu.id,
      bodovi:{[Op.lt]:10}}
    }).then(
      async rezultati_palih_ispita =>{
        let id_ispita=[];
        for(let i=0;i<rezultati_palih_ispita.length;i++)
            id_ispita.push(rezultati_palih_ispita[i].idIspit);
        db.ispit.findAll({where:{idIspit:{[Op.in]:id_ispita}}}).then(
          async lista_palih_ispita=>{
            let id_predmeta=[];

            for(let i=0;i<lista_palih_ispita.length;i++)
              id_predmeta.push(lista_palih_ispita[i].idPredmet);

            db.predmet.findAll({where:{id:{[Op.in]:id_predmeta}}}).then(
              async lista_palih_predmeta=>{
                let konacno=[];
                for(let i=0;i<lista_palih_ispita.length;i++)
                  konacno.push({
                    indeks:stu.indeks,
                    naziv: stu.ime+" "+stu.prezime,
                    predmet: lista_palih_predmeta[i].naziv,
                    datumIspita:lista_palih_ispita[i].termin,
                    tipIspita: lista_palih_ispita[i].tipIspita,
                    brojBodova: rezultati_palih_ispita[i].bodovi
                  });
                  res.json(konacno);
            });
          }
        );
      }
    );
});

});
app.get('/Izvjestaji/dajIspiteNaKojeJeIzasao/:index', async function(req,res){
let _indeks = req.params.index;

db.korisnik.findOne({where:{indeks:_indeks}}).then(
  async student => {
    if(student != null && student != undefined)
    db.ispiti_rezultati.findAll({where:{idStudent:student.id}}).then(
      async rezultati_ispita=>{
        let id_ispita=[];
        for(let i=0;i<rezultati_ispita.length;i++)
            id_ispita.push(rezultati_ispita[i].idIspit);
            db.ispit.findAll({where:{idIspit:{[Op.in]:id_ispita}}}).then(
              async ispiti=>{
                let konacno=[];
                for(let i=0;i<ispiti.length;i++)
                  konacno.push({
                    indeks:student.indeks,
                    naziv: student.ime+" "+student.prezime,
                    predmet: ispiti[i].naziv,
                    datumIspita: ispiti[i].termin,
                    tipIspita: ispiti[i].tipIspita,
                    brojBodova: ispiti[i].bodovi
                  });
                  res.json(konacno);
              }
            );
      }
    );
    else res.json([]);
  }
);

});
app.listen(31912);
