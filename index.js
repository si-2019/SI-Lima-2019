const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
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
