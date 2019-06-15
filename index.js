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

app.get('/dajBodoveProjekatacsv/:index/:predmet', function(req, res) {
const csvWriter = createCsvWriter({  
  path: 'us28csv.csv',
  //Podaci u izvjestaju
  header: [
    {id: 'ime', title: 'Ime'},
    {id: 'prezime', title: 'Prezime'},
    {id: 'indeks', title: 'Index'},
    {id: 'predmet', title: 'Prezime'},
	{id: 'projekatNaziv',title: 'Projekat naziv'},
	{id: 'projekatBodovi', title: 'Projekat bodovi'}
  ]
});
//Dohvaćanje podataka koje stavljamo u izvještaj
//user story 28 - Kao student, želim da imam mogućnost za odabir izvještaja o ostvarenom broju bodova na 
//projektima za pojedini predmet, kako bih dobio željene informacije
//salje se id studenta i predmeta, vracaju se podaci o ostvarenom broju bodova na projektima za taj predmet i tog studenta

  var indeksParam = req.params.index;
  var predmetParam = req.params.predmet; 
  db.korisnik.findOne({where : {indeks: indeksParam}}).then(function(student) {
    db.predmet.findOne({where : {naziv : predmetParam}}).then(function(predmet) {
      db.projekat.findAll({where : {idKorisnik: student.id, idPredmet: predmet.id}}).then(function(projekti) {
        var odgovor = [];
        //buduci da baza nije dobro dizajnirana, u njoj se ne nalaze podaci o ostvarenom broju bodova na nekom projektu
        //uradjena je improvizacija pa ce bodovi na projektu biti postotak uradjenog: proizvod 'progress' (u tabeli 'Projekat') i moguceg broja bodova
        for(var i=0; i<projekti.length; i++) {
          var bodovi = projekti[i].progress*projekti[i].moguciBodovi;
          odgovor.push({
            ime: student.ime,
            prezime: student.prezime,
            indeks: student.indeks,
            predmet: predmet.naziv,
            projekatNaziv: projekti[i].nazivProjekta,
            projekatBodovi: bodovi
          });
        }
        res.json(odgovor);
		csvWriter  
		.writeRecords(odgovor)
		.then(()=> console.log('CSV fajl uspjesno kreiran'));
      });
    });
  });
});
app.listen(PORT,function(){ console.log('server successfully started on port '+PORT); });
// app.listen(8080);
  });
});
