const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const url = require('url');
const db = require(__dirname + "/db.js");
const Op = Sequelize.Op;

db.sequelize.sync().then(function() {});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./stari_zahtjevi.js')(app)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/Izvjestaji/dajPredmetPoGodini/:predmetId/:godinaId/:filter/:datum",function(req,res){
  let id_predmeta = req.params.predmetId;
  let id_godine = req.params.godinaId;
  let filter = req.params.filter;
  let datum =  Date(req.params.datum);
  db.predmet.findOne({where:{id:id_predmeta}}).then(async p=>{
    db.akademskaGodina.findOne({where:{id:id_godine}}).then(async g=>{
        switch(filter){
          case "Prvi parcijalni":
            db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Prvi parcijalni",termin:datum}}).then(async ispiti=>{
              let nizIspitId = [];  for(let i=0;i<ispiti.length;i++) nizIspitId.push(ispiti[i].id);
              db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitId}}}).then(async rezultati_ispita=>{
                // rezultati_ispita imaju podatke o studentima koji su položili kao i njihove bodove
                db.predmetStudent.findAll({where:{idPredmet:id_predmeta}}).then(async sviStudentiNaPredmetu=>{
                  //unutar sviKojiSuIzasli postoji ID-evi studenta, kao i akademska godina, ocjena i datum upisa ocjene za pojedini predmet.
                    let id_studenata = []; for(let i=0;i<sviStudentiNaPredmetu.length;i++) id_studenata.push(sviStudentiNaPredmetu[i].idStudent)
                    let ukupno = sviStudentiNaPredmetu.length;
                    let izaslo = 0;
                    let data = [];
                    for(let i=0;i<rezultati_ispita.length;i++){
                      if(id_studenata.contains(rezultati_ispita[i].idStudent)) izaslo++;
                      if(rezultati_ispita[i].bodovi>=10) data.push(rezultati_ispita[i].bodovi);
                    }
                    let polozilo = data.length;

                    res.json({
                      izasloNaIspit:izaslo,
                      ukupnoStudenata:ukupno,
                      polozilo:polozilo,
                      data: data
                    });
                });
              });
            });
          break;
          case "Drugi parcijalni":
            db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Drugi parcijalni",termin:datum}}).then(async ispiti=>{
              let nizIspitId = [];  for(let i=0;i<ispiti.length;i++) nizIspitId.push(ispiti[i].id);
              db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitId}}}).then(async rezultati_ispita=>{
                // rezultati_ispita imaju podatke o studentima koji su položili kao i njihove bodove
                db.predmetStudent.findAll({where:{idPredmet:id_predmeta}}).then(async sviStudentiNaPredmetu=>{
                  //unutar sviKojiSuIzasli postoji ID-evi studenta, kao i akademska godina, ocjena i datum upisa ocjene za pojedini predmet.
                    let id_studenata = []; for(let i=0;i<sviStudentiNaPredmetu.length;i++) id_studenata.push(sviStudentiNaPredmetu[i].idStudent)
                    let ukupno = sviStudentiNaPredmetu.length;
                    let izaslo = 0;
                    let data = [];
                    for(let i=0;i<rezultati_ispita.length;i++){
                      if(id_studenata.contains(rezultati_ispita[i].idStudent)) izaslo++;
                      if(rezultati_ispita[i].bodovi>=10) data.push(rezultati_ispita[i].bodovi);
                    }
                    let polozilo = data.length;

                    res.json({
                      izasloNaIspit:izaslo,
                      ukupnoStudenata:ukupno,
                      polozilo:polozilo,
                      data: data
                    });
                });
              });
            });  
          break;
          case "Usmeni":
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Usmeni",termin:datum}}).then(async ispiti=>{
                let nizIspitId = [];  for(let i=0;i<ispiti.length;i++) nizIspitId.push(ispiti[i].id);
                db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitId}}}).then(async rezultati_ispita=>{
                  // rezultati_ispita imaju podatke o studentima koji su položili kao i njihove bodove
                  db.predmetStudent.findAll({where:{idPredmet:id_predmeta}}).then(async sviStudentiNaPredmetu=>{
                    //unutar sviKojiSuIzasli postoji ID-evi studenta, kao i akademska godina, ocjena i datum upisa ocjene za pojedini predmet.
                      let id_studenata = []; for(let i=0;i<sviStudentiNaPredmetu.length;i++) id_studenata.push(sviStudentiNaPredmetu[i].idStudent)
                      let ukupno = sviStudentiNaPredmetu.length;
                      let izaslo = 0;
                      let data = [];
                      for(let i=0;i<rezultati_ispita.length;i++){
                        if(id_studenata.contains(rezultati_ispita[i].idStudent)) izaslo++;
                        if(rezultati_ispita[i].bodovi>=10) data.push(rezultati_ispita[i].bodovi);
                      }
                      let polozilo = data.length;
  
                      res.json({
                        izasloNaIspit:izaslo,
                        ukupnoStudenata:ukupno,
                        polozilo:polozilo,
                        data: data
                      });
                  });
                });
              });  
          break;
          case "Prisustvo":
              db.prisustvoPredavanja.findAll({where:{idPredmeta:p.id}}).then(async predavanja=>{
                db.prisustvoTutorijali.findAll({where:{idPredmeta:p.id}}).then(async tutorijali=>{
                  db.prisustvoVjezbe.findAll({where:{idPredmeta:p.id}}).then(async vjezbe=>{
                    let odgovor = predavanja.concat(tutorijali.concat(vjezbe));
                    res.send(odgovor); res.end();
                  });
                });
              });
          break;
          case "Zadaca":
              db.zadaca.findAll({where:{idPredmet:p.id}}).then(async zadace=>{
                let id_zadaca = []; for(let i=0;i<zadace.length;i++) id_zadaca.push(zadace[i].idZadaca);

                db.zadatak.findAll({where:{idZadaca:{[Op.in]:id_zadaca}}}).then(async zadaci=>{
                let id_zadataka=[]; for(let i=0;i<zadaci.length;i++) id_zadataka.push(zadaci[i].idZadatak);

                  db.student_zadatak.findAll({where:{idZadatak:{[Op.in]:id_zadataka}}}).then(async dobijeni_bodovi=>{
                    let odgovor = [];
                    for(let i=0;i<dobijeni_bodovi.length;i++)
                      odgovor.push(dobijeni_bodovi[i].brojOstvarenihBodova);
                    res.send(odgovor);res.end();
                  });
                });
              });
          break;
          case "Bodovi":
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Prvi parcijalni"}}).then(async prveParcijale=>{
              let nizIspitIdPrveParcijale = [];  for(let i=0;i<prveParcijale.length;i++) nizIspitIdPrveParcijale.push(prveParcijale[i].id);
              db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitIdPrveParcijale}}}).then(async rezultati_ispitaPrveParcijale=>{
                // rezultati_ispita imaju podatke o studentima koji su položili kao i njihove bodove
                db.predmetStudent.findAll({where:{idPredmet:id_predmeta}}).then(async sviStudentiNaPredmetu=>{
                  //unutar sviKojiSuIzasli postoji ID-evi studenta, kao i akademska godina, ocjena i datum upisa ocjene za pojedini predmet.
                    let id_studenata = []; for(let i=0;i<sviStudentiNaPredmetu.length;i++) id_studenata.push(sviStudentiNaPredmetu[i].idStudent)
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Drugi parcijalni"}}).then(async drugeParcijale=>{
                let nizIspitIdDrugeParcijale=[]; for(let i=0;i<drugeParcijale.length;i++)nizIspitIdDrugeParcijale.push(drugeParcijale[i].id)

                  db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitIdDrugeParcijale}}}).then(async rezultati_ispitaDrugeParcijale=>{
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Usmeni"}}).then(async zavrsni=>{
                let nizIspitIdZavrsni=[]; for(let i=0;i<zavrsni.length;i++) nizIspitIdZavrsni.push(zavrsni[i].id);
                db.ispiti_rezultati.findAll({where:{idIspit:{[Op.in]:nizIspitIdZavrsni}}}).then(async rezultati_ispitaUsmeni=>{
                   
                  db.zadaca.findAll({where:{idPredmet:p.id}}).then(async sveZadace=>{
                      let id_zadaca = []; for(let i=0;i<sveZadace.length;i++) id_zadaca.push(sveZadace[i].idZadaca);
                      db.zadatak.findAll({where:{idZadaca:{[Op.in]:id_zadaca}}}).then(async sviZadaci=>{
                        let id_zadataka = []; for(let i=0;i<sviZadaci.length;i++) id_zadataka.push(sviZadaci[i].idZadatak);
                        
                        db.student_zadatak.findAll({where:{idZadatak:{[Op.in]:id_zadataka}}}).then(async ostvareniBodoviZadaca => {
                          let odgovor = [];
                          let hepek = 0;
                          db.prisustvoPredavanja.findAll({where:{idPredmeta:p.id}}).then(async predavanja=>{
                            db.prisustvoTutorijali.findAll({where:{idPredmeta:p.id}}).then(async tutorijali=>{
                              db.prisustvoVjezbe.findAll({where:{idPredmeta:p.id}}).then(async vjezbe=>{
                                let odgovor = predavanja.concat(tutorijali.concat(vjezbe));
                                let vrati = [];
                                  for(let i=0;i<odgovor.length;i++){
                                    hepek=ostvareniBodoviZadaca[i].brojOstvarenihBodova+rezultati_ispitaPrveParcijale[i].bodovi+
                                    rezultati_ispitaDrugeParcijale[i].bodovi+rezultati_ispitaUsmeni[i].bodovi+
                                    predavanja[i].prisutan && tutorijali[i].prisutan && vjezbe[i].prisutan ? 10 : 0;
                                    vrati.push(hepek);
                                  }
                                res.send(vrati);res.end();
                              });
                            });
                          });
                        });

                      });
                   
                    });

                });
              });

                  });
                });    
                });
              });
            });
          break;
          case "Ocjena":
              db.predmetStudent.findAll({where:{idPredmet:p.id,idAkademskaGodina:id_godine}}).then(async ocjene=>{
                let odg = []; for(let i=0;i<ocjene.length;i++) odg.push(ocjene[i].ocjena);
                res.send(odg); res.end();
              });
          break;
          case "null":
            try{
              var nazivPredmeta =   p.naziv;
              var nazivGodine = g.naziv;
            }catch{
              res.json({message:"Nepostojeći predmet"});
            }
              let nizStavki= [
                {tip:"Prisustvo"}, 
                {tip:"Zadaca"}, 
                {tip:"Bodovi"}, 
                {tip:"Ocjena"}
            ]
            try{
            db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Prvi parcijalni",termin:{[Op.or]:{[Op.between]:[g.pocetak_zimskog_semestra,g.kraj_zimskog_semestra],[Op.between]:[g.pocetak_ljetnog_semestra,g.kraj_ljetnog_semestra]}}}}).
            then(async prveParcijale=>{ 
              let kepec;
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Drugi parcijalni",termin:{[Op.or]:{[Op.between]:[g.pocetak_zimskog_semestra,g.kraj_zimskog_semestra],[Op.between]:[g.pocetak_ljetnog_semestra,g.kraj_ljetnog_semestra]}}}}).
            then(async drugeParcijale=>{
              let kepec;
              db.ispit.findAll({where:{idPredmet:p.id,tipIspita:"Usmeni",termin:{[Op.or]:{[Op.between]:[g.pocetak_zimskog_semestra,g.kraj_zimskog_semestra],[Op.between]:[g.pocetak_ljetnog_semestra,g.kraj_ljetnog_semestra]}}}}).
            then(async usmeniIspiti=>{
              let kepec;
              for(let i=0;i<prveParcijale.length;i++) nizStavki.push({tip:"Prvi parcijalni",datum:prveParcijale[i].termin});
              for(let i=0;i<drugeParcijale.length;i++) nizStavki.push({tip:"Drugi parcijalni",datum:drugeParcijale[i].termin});
              for(let i=0;i<usmeniIspiti.length;i++) nizStavki.push({tip:"Usmeni",datum:usmeniIspiti[i].termin});
              res.json({
                nazivPredmeta:nazivPredmeta,
                nazivGodine:nazivGodine,
                nizStavki:nizStavki
              });
            });
            
            });


            });
          }catch{
            res.json({message:"Greška na serveru"});
          }
          
          break;
        default:
          res.json({message:"Greška na serveru"});
        }
    });
  });
});
// Prosjek studenta po godinama
app.get("/izvjestaj/prosjekPoGodinama/:idStudenta", function(req, res) {
  var message;
  db.predmetStudent
    .findAll({
      where: {
        idStudent: req.params.idStudenta,
        ocjena: { [Sequelize.Op.not]: null }
      }
    })
    .then(async function(predmeti) {
      if (predmeti.length === 0) {
        message = "Nema upisanih ocjena";
        res.json([{ message: message }]);
      } else {
        var prosjeci = [];
        predmeti.sort((a, b) => {
          return a.idAkademskaGodina > b.idAkademskaGodina;
        });
        var i = 0;
        while (i < predmeti.length) {
          var prosjek = [];
          var ak = await db.akademskaGodina.findOne({
            where: { id: predmeti[i].idAkademskaGodina }
          });
          var naziv = ak.naziv;
          var godinaId = predmeti[i].idAkademskaGodina;
          var ukupni = 0;
          let brojPredmeta = 0;
          let god = predmeti[i].idAkademskaGodina;
          while (i < predmeti.length && predmeti[i].idAkademskaGodina === god) {
            brojPredmeta++;
            ukupni = ukupni + predmeti[i].ocjena;
            i++;
          }
          prosjeci.push({
            naziv: naziv,
            godinaId: godinaId,
            prosjek: ukupni / brojPredmeta
          });
        }
        prosjeci.sort((a, b) => a.naziv.substr(0, 4) - b.naziv.substr(0, 4));
        res.json(prosjeci);
      }
    });
});
// Dodavanje precice
app.post("/izvjestaji/dodajPrecicu", function(req, res){
  var precica = req.body;
  db.sacuvaniIzvjestaji.findOne({ where:{studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId']}}).then((izvjestaj)=>{
    if(izvjestaj!=null)
      return true;
    else{
      db.sacuvaniIzvjestaji.create({studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId'], naziv:precica['naziv']})
      return false;
    }
  }).then(postoji=>{
    if (postoji=== true)
      res.json({message:"Taj izvjestaj je vec sacuvan."});
    else
      res.json({message:"ok"});
    
  }
    
 )

});
// Brisanje precice
app.post("/izvjestaji/obrisiPrecicu", function(req, res){
  var precica = req.body;
  db.sacuvaniIzvjestaji.findOne({where:{studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId']}}).then((izvjestaj)=>{
    if(izvjestaj===null)
      res.json({message:"Ne postoji precica"});
    else{
      db.sacuvaniIzvjestaji.destroy({where:{studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId'], naziv:precica['naziv']}}).then(()=>res.json({message:"ok"}));
        
    }
  })
});
// Pregled svih precica studenta
app.get("/izvjestaji/precice", function(req, res){
  var sId= url.parse(req.url, true).query['studentId'];
  db.sacuvaniIzvjestaji.findAll({attributes:['naziv', 'godinaId', 'predmetId'],where:{studentId: sId}}).then(rez=>{
    res.json(rez);
  })

});
// svi predmeti
app.get("/predmeti", function(req, res){
  db.predmet.findAll({attributes:['id', 'naziv']}).then(predmeti=>res.json(predmeti))
});
//polozeni i nepolozeni predmeti studenta
app.get("/predmeti_studenta", function(req,res){
  var sId= url.parse(req.url, true).query['studentId'];
  var polozeni_p=[];
  db.predmetStudent.findAll({ where:{IdStudent:sId, ocjena: { [Sequelize.Op.not]: null }}}).then(polozeni=>{
    var promisi= [];
    for ( var i =0; i< polozeni.length; i++){
      promisi.push(
      db.predmet.findOne({attributes:['id','naziv'], where: {id:polozeni[i].idPredmet}}).then(p=>polozeni_p.push(p))
      );
    }
    Promise.all(promisi).then(()=>{
      var nepolozeni_p=[];
      db.predmetStudent.findAll({ where:{IdStudent:sId, ocjena: null }}).then(nepolozeni=>{
       var promisi2=[];
        for ( var i =0; i< nepolozeni.length; i++){
          promisi2.push(
            db.predmet.findOne({attributes:['id','naziv'], where: {id:nepolozeni[i].idPredmet}}).then(p=>nepolozeni_p.push(p))
            );
        }
        Promise.all(promisi2).then(()=>{res.json({polozeni:polozeni_p, nepolozeni:nepolozeni_p})});
      })
    });
  })
});

app.listen(31912, () => {
  console.log("Server started, listening at port 31912");
});