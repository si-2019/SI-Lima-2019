const createCsvWriter = require('csv-writer').createObjectCsvWriter; 
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
  .sync({ force: false }) 
  .then(() => {
    console.log("Konektovan na bazu!");
  })
  .catch(e => {
    console.log("Greska");
    console.log(e);
});

app.get("/izvjestajcsv/:predmet/:akademska/prvaParcijalaPredmeta", async function(req,res) {
const csvWriter = createCsvWriter({  
  path: 'us32csv.csv',
  header: [
    {id: 'predmetNaGodini', title: 'PredmetNaGodini'},
    {id: 'biloIspita', title: 'BiloIspita'},
    {id: 'id', title: 'ID'},
    {id: 'ime', title: 'Ime'},
	{id: 'prezime', title: 'Prezime'},
	{id: 'index',title: 'Index'},
	{id: 'bodovi', title: 'Bodovi'},
	{id: 'datum', title: 'Datum'}
  ]
});

//I_US_56

  let odgovor = { studenti: [] };
  let pred = req.params.predmet; //predmet
  let aktuelnaAkademska = req.params.akademska; //id akademske

  let objekat = {
    predmetNaGodini: true,
    biloIspita: true,
    id: null,
    ime: "/",
    prezime: "/",
    index: "/",
    bodovi: "/",
    datum: "/"
  };
  //nadji odabrani predmet id=8
  let izabraniPredmet = await db.predmet.findOne({
    where: { naziv: pred }
  });
  //nadji sve studente na predmetu id=3 duzina 1
  let idstudentPredmet = await db.predmetStudent.findAll({
    where: {
      idPredmet: izabraniPredmet.id,
      idAkademskaGodina: aktuelnaAkademska
    }
  });
  //ako nema studenata na osnovu uslova, predmet nije na godini
  if (idstudentPredmet.length === 0) {
    objekat.predmetNaGodini = false;
    odgovor.studenti.push(objekat);
    res.json(odgovor);
  }
  //ako je predmet na godini nadji prve parcijale
  else {
    //nadji prve parcijale predmeta id=1 duzina 1
    let prveParcijale = await db.ispit.findAll({
      where: { idPredmet: izabraniPredmet.id, tipIspita: "Prvi parcijalni" }
    });
    //nije bilo ispita na predmetu
    if (prveParcijale.length === 0) {
      objekat.biloIspita = false;
      odgovor.studenti.push(objekat);
      res.json(odgovor);
    }
    //bilo prvih parcijala, nadji podatke tih prvih parcijala u ispiti_rezultati
    else {
      for (let i = 0; i < prveParcijale.length; i++) {
        for (let j = 0; j < idstudentPredmet.length; j++) {
          //nadji rezultate jedne od odrzane prve parcijale
          await db.ispitBodovi
            .findOne({
              where: {
                idIspita: prveParcijale[i].idIspit,
                idKorisnika: idstudentPredmet[j].idStudent
              }
            })
            .then(async rez => {
              //nadji studenta sa id-om
              let student = await db.korisnik.findOne({
                where: { id: idstudentPredmet[j].idStudent }
              });
              let objekat = {
                predmetNaGodini: true,
                biloIspita: true,
                id: student.id,
                ime: student.ime,
                prezime: student.prezime,
                index: student.indeks,
                bodovi: "/",
                datum: prveParcijale[i].termin
              };
              //ako je rez null, znaci da student nije izasao na ispit
              if (rez === null) {
                odgovor.studenti.push(objekat);
              } else {
                //ako je izasao daj bodove
                objekat.bodovi = rez.bodovi;
                odgovor.studenti.push(objekat);
              }
            });
        }
      }
		res.json(odgovor);
		csvWriter  
		.writeRecords(odgovor)
		.then(()=> console.log('CSV fajl je uspjesno kreiran'));
      });
    });
  });
app.listen(PORT,function(){ console.log('server successfully started on port '+PORT); });
// app.listen(8080);
  });
});
