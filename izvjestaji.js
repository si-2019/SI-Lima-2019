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
app.get("/Izvjestaji/dajDrugeParcijale/:index/:predmet", async function(
  req,
  res
) {
  //console.log("Podao sam ga na lima");
  let _indeks = req.params.index;
  let predmet = req.params.predmet;

  let rezultati = [];
  db.korisnik.findOne({ where: { indeks: _indeks } }).then(async stu => {
    db.predmet.findOne({ where: { naziv: predmet } }).then(async pred => {
      if (pred == null || pred == undefined)
        res.json({ message: "404, nepostojeći predmet" });
      else {
        db.ispit
          .findAll({
            where: { idPredmet: pred.id, tipIspita: "Drugi parcijalni" }
          })
          .then(async ispiti => {
            let ispiti_id = [];
            for (let i = 0; i < ispiti.length; i++)
              ispiti_id.push(ispiti[i].idIspit);
            db.ispiti_rezultati
              .findAll({
                where: {
                  idIspit: { [Op.in]: ispiti_id },
                  idStudent: stu.id
                }
              })
              .then(konacno => {
                let odg = [];
                for (let i = 0; i < konacno.length; i++)
                  odg.push({
                    indeks: _indeks,
                    ime: stu.ime,
                    prezime: stu.prezime,
                    datumIspita: ispiti[i].termin,
                    brojBodova: konacno[i].bodovi
                  });
                res.json(odg);
              });
          });
      }
    });
  });
});
//app.listen(31912);

app.get("/Izvjestaji/dajPolozeneIspite/:index", function(req, res) {
  let _indeks = req.params.index;
  //let predmet = req.params.predmet;
  //let tekucaGodina = Date.getFullYear();

  db.korisnik.findOne({ where: { indeks: _indeks } }).then(async student => {
    if (student == null || student == undefined)
      res.json({ message: "Student s tim indeksom ne postoji!" });
    db.ispiti_rezultati
      .findAll({ where: { idStudent: student.id }, bodovi: { $gt: 9 } })
      .then(async rezultati => {
        var listaPromisea1 = [];
        for (var i = 0; i < rezultati.length; i++) {
          listaPromisea1.push(
            db.ispit.findOne({ where: { idIspit: rezultati[i].idIspit } })
          );
        }
        var listaPromisea2 = [];
        var tmp;
        Promise.all(listaPromisea1)
          .then(function(ispitiFilter) {
            tmp = ispitiFilter;
            for (var j = 0; j < ispitiFilter.length; j++) {
              listaPromisea2.push(
                db.predmet.findOne({ where: { id: ispitiFilter[j].idPredmet } })
              );
            }

            return Promise.all(listaPromisea2);
          })
          .then(function(predmeti) {
            var odgovor = [];

            for (var k = 0; k < predmeti.length; k++) {
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

// I_US_25, I_US_26
app.get("/dajPredmete", async function(req, res) {
  let odgovor = { predmeti: [] };
  db.predmet.findAll().then(async rez => {
    for (let i = 0; i < rez.length; ++i) {
      let objekat = {
        id: rez[i].id,
        idAsistent: rez[i].idAsistent,
        idProfesor: rez[i].idProfesor,
        naziv: rez[i].naziv,
        ects: rez[i].ects,
        brojPredavanja: rez[i].brojPredavanja,
        brojVjezbi: rez[i].brojVjezbi,
        opis: rez[i].opis
      };
      odgovor.predmeti.push(objekat);
    }
    res.json(odgovor);
  });
});

// I_US_25
app.get("/izvjestaj/:index/:predmet/bodovi", async function(req, res) {
  let odgovor = { bodovi: [] };
  let ind = req.params.index;
  let pred = req.params.predmet;

  let predmetstudent; //za pamcenje ocjene
  let ispiti = []; //ispiti za

  let brojac = 0; //broji minuse za prisustvo

  let objekat = {
    postojiStudent: true,
    slusaPredmet: true,
    prisustvo: "/",
    moguciBodPrisus: 0,
    prviParcijalni: "/",
    moguciBodPrve: 0,
    drugiParcijalni: "/",
    moguciBodDruge: 0,
    zavrsni: "/",
    moguciBodZavrsnog: 0,
    zadaca: "/",
    moguciBodZad: 0,
    projekat: "/",
    moguciBodPro: 0,
    ocjena: "/"
  };

  let student = await db.korisnik.findOne({
    where: { indeks: ind }
  });
  //ako nema studenta sa indeksom unesenim
  if (student == null) {
    objekat.postojiStudent = false;
    odgovor.bodovi.push(objekat);
    res.json(odgovor);
    //ako ima studenta da unesenim indeksom
  } else {
    //ako ima studenta, nađi predmet u bazi
    let izabraniPredmet = await db.predmet.findOne({
      where: { naziv: pred }
    });
    //nadji sve predmete koje slusa student i od njih vidi ima li izabranog
    db.predmetStudent
      .findAll({ where: { idStudent: student.id } })
      .then(async rez => {
        for (let i = 0; i < rez.length; i++) {
          if (rez[i].idPredmet == izabraniPredmet.id) predmetstudent = rez[i];
        }
        //ako student ne slusa taj predmet
        if (predmetstudent == null) {
          objekat.slusaPredmet = false;
          odgovor.bodovi.push(objekat);
          res.json(odgovor);
        } else {
          //----OCJENA
          //postavi ocjenu ako je upisana
          if (predmetstudent.ocjena != null)
            objekat.ocjena = predmetstudent.ocjena;

          //----PRISUSTVO
          //postavi prisustvo na 10 osim ako ima vise od 3 minusa
          objekat.moguciBodPrisus = 10; //trenutno hardkodirano
          db.prisustvoPredavanja
            .findAll({
              where: { idStudenta: student.id, idPredmeta: izabraniPredmet.id }
            })
            .then(rez1 => {
              for (let i = 0; i < rez1.length; i++)
                if (rez1[i].prisutan == false) brojac++;
              db.prisustvoTutorijali
                .findAll({
                  where: {
                    idStudenta: student.id,
                    idPredmeta: izabraniPredmet.id
                  }
                })
                .then(rez2 => {
                  for (let i = 0; i < rez2.length; i++)
                    if (rez2[i].prisutan == false) brojac++;
                  db.prisustvoVjezbe
                    .findAll({
                      where: {
                        idStudenta: student.id,
                        idPredmeta: izabraniPredmet.id
                      }
                    })
                    .then(rez3 => {
                      for (let i = 0; i < rez3.length; i++)
                        if (rez3[i].prisutan == false) brojac++;
                      if (brojac > 3) objekat.prisustvo = 0;
                      else objekat.prisustvo = 10;

                      //---- ISPITI, ostali moguci bodovi
                      //nadji ispite za taj predmet
                      db.ispit
                        .findAll({ where: { idPredmet: izabraniPredmet.id } })
                        .then(async rez4 => {
                          //ako nema rezultata nije bilo ispita
                          if (rez4.length != 0) {
                            //bilo je ispita
                            ispiti = rez4;
                            //naci rezultate tih ispita i za prvu i za drugu parcijalu i zavrsni
                            for (let i = 0; i < ispiti.length; i++) {
                              let nadjeni = await db.ispitBodovi.findOne({
                                where: {
                                  idKorisnika: student.id,
                                  idIspita: ispiti[i].idIspit
                                }
                              });
                              //ako se ispit zaista odrzao
                              if (nadjeni != null) {
                                let tipIspita = ispiti[
                                  i
                                ].tipIspita.toLowerCase();
                                tipIspita = tipIspita.replace(/\s/g, "");
                                if (tipIspita.includes("prvi")) {
                                  objekat.prviParcijalni = nadjeni.bodovi;
                                  //trenutno hardkodirano, dok se ne unese u bazu, ako se uopste unese LOL
                                  objekat.moguciBodPrve = 20;
                                } else if (tipIspita.includes("drugi")) {
                                  objekat.drugiParcijalni = nadjeni.bodovi;
                                  //trenutno hardkodirano, dok se ne unese u bazu, ako se uopste unese LOL
                                  objekat.moguciBodDruge = 20;
                                } else if (tipIspita.includes("zavrsni")) {
                                  objekat.zavrsni = nadjeni.bodovi;
                                  //trenutno hardkodirano, dok se ne unese u bazu, ako se uopste unese LOL
                                  objekat.moguciBodZavrsnog = 40;
                                }
                              }
                            }
                          }

                          //---- ZADACA, ostalo ostvareni bodovi, nema u bazi
                          db.zadaca
                            .findAll({
                              where: { idPredmet: izabraniPredmet.id }
                            })
                            .then(rez => {
                              let moguciBodovi = 0;
                              for (let i = 0; i < rez.length; i++)
                                moguciBodovi += rez[i].ukupnoBodova;
                              objekat.moguciBodZad = moguciBodovi;

                              //---- PROJEKAT, ostalo ostvareni bodovi
                              db.projekat
                                .findAll({
                                  where: { idPredmet: izabraniPredmet.id }
                                })
                                .then(rez5 => {
                                  let moguciBodovi = 0;
                                  for (let i = 0; i < rez5.length; i++)
                                    moguciBodovi += rez5[i].moguciBodovi;
                                  objekat.moguciBodPro = moguciBodovi;
                                  odgovor.bodovi.push(objekat);
                                  res.json(odgovor);
                                });
                            });
                        });
                    });
                });
            });
        }
      });
  }
});

//I_US_26
app.get("/izvjestaj/:index/:predmet/bodoviPrveParcijale", async function(
  req,
  res
) {
  let odgovor = { bodovi: [], informacije: [] };
  let ind = req.params.index;
  let pred = req.params.predmet;

  let predmetstudent;
  let ispiti = []; //ispiti za predmet

  let objekat = {
    postojiStudent: true,
    slusaPredmet: true
  };

  let student = await db.korisnik.findOne({
    where: { indeks: ind }
  });
  //ako nema studenta sa indeksom unesenim
  if (student == null) {
    objekat.postojiStudent = false;
    odgovor.informacije.push(objekat);
    res.json(odgovor);
    //ako ima studenta da unesenim indeksom
  } else {
    //ako ima studenta, nađi predmet u bazi
    let izabraniPredmet = await db.predmet.findOne({
      where: { naziv: pred }
    });
    //nadji sve predmete koje slusa student i od njih vidi ima li izabranog
    db.predmetStudent
      .findAll({ where: { idStudent: student.id } })
      .then(async rez => {
        for (let i = 0; i < rez.length; i++) {
          if (rez[i].idPredmet == izabraniPredmet.id) predmetstudent = rez[i];
        }
        //ako student ne slusa taj predmet
        if (predmetstudent == null) {
          objekat.slusaPredmet = false;
          odgovor.informacije.push(objekat);
          res.json(odgovor);
        } else {
          //---- PRVE PARCIJALE PREDMETA
          //nadji ispite za taj predmet
          db.ispit
            .findAll({ where: { idPredmet: izabraniPredmet.id } })
            .then(async rez => {
              //ako nema rezultata nije bilo ispita
              if (rez.length != 0) {
                //bilo je ispita
                ispiti = rez;
                //naci rezultate tih ispita za prvu parcijalu
                for (let i = 0; i < ispiti.length; i++) {
                  let nadjeni = await db.ispitBodovi.findOne({
                    where: {
                      idKorisnika: student.id,
                      idIspita: ispiti[i].idIspit
                    }
                  });
                  if (nadjeni != null) {
                    let tipIspita = ispiti[i].tipIspita.toLowerCase();
                    tipIspita = tipIspita.replace(/\s/g, "");
                    if (tipIspita.includes("prvi")) {
                      let objekat1 = {
                        id: nadjeni.idIspita,
                        prviParcijalni: nadjeni.bodovi,
                        moguciBodPrve: 20, //trenutno hardkodirano, dok se ne unese u bazu, ako se uopste unese LOL
                        datum: ispiti[i].termin
                      };
                      odgovor.bodovi.push(objekat1);
                    }
                  }
                }
                odgovor.informacije.push(objekat);
                res.json(odgovor);
              } else {
                odgovor.informacije.push(objekat);
                res.json(odgovor);
              }
            });
        }
      });
  }
});
app.listen(31912, () => {
  console.log("Server started, listening at port 31912");
});
