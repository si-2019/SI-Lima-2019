const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const url = require('url');
const db = require(__dirname + "/db.js");
const Op = Sequelize.Op;

var PORT=process.env.PORT||31912;
db.sequelize.sync().then(function() {});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./stari_zahtjevi.js')(app)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/Izvjestaji/dataPredmetPoGodini/:predmetId/:godinaId/:filter/:datum",function(req,res){
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
            db.predmetStudent.findAll({where:{idPredmet:id_predmeta, idAkademskaGodina: id_godine}}).then(studenti=>{
              var bodovi=[]
              for(var i=0; i<studenti.length; i++){
                      bodovi.push(10);    
              }
              res.json(bodovi);
            })
             /* db.prisustvoPredavanja.findAll({where:{idPredmeta:p.id}}).then(async predavanja=>{
                db.prisustvoTutorijali.findAll({where:{idPredmeta:p.id}}).then(async tutorijali=>{
                  db.prisustvoVjezbe.findAll({where:{idPredmeta:p.id}}).then(async vjezbe=>{
                    let odgovor = predavanja.concat(tutorijali.concat(vjezbe));
                    res.send(odgovor); res.end();
                  });
                });
              });*/
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
            db.predmetStudent.findAll({where:{idPredmet:id_predmeta, idAkademskaGodina:id_godine}}).then(async studenti=>{
              var bodovi=[];
              for(var i=0; i<studenti.length; i++){
                  var bod=10;
                  var pp = await db.ispit.findOne({where:{idPredmet:id_predmeta, tipIspita:"Prvi parcijalni"}});
                  if(pp!=null){
                  var pbodovi= await db.ispitBodovi.findOne({where:{idIspita:pp.idIspit, idKorisnika: studenti[i].idStudent}});
                  if(pbodovi!==null){
                    bod+= pbodovi.bodovi;
                  }
                  }
                  var dp = await db.ispit.findOne({where:{idPredmet:id_predmeta, tipIspita:"Drugi parcijalni"}});
                  if(dp!=null){
                  var dbodovi= await db.ispitBodovi.findOne({where:{idIspita:dp.idIspit, idKorisnika: studenti[i].idStudent}});
                  if(dbodovi!==null){
                    bod+= dbodovi.bodovi;
                  }
                  }
                  var us = await db.ispit.findOne({where:{idPredmet:id_predmeta, tipIspita:"Usmeni"}});
                  if(us!=null){
                  var ubodovi= await db.ispitBodovi.findOne({where:{idIspita:us.idIspit, idKorisnika: studenti[i].idStudent}});
                  if(ubodovi!==null){
                    bod+= ubodovi.bodovi;
                  }
                  }
                  var zadaca= await db.zadaca.findAll({where:{idPredmet:id_predmeta}});
                  for(j=0; j<zadaca.length; j++){
                    var zadatak = await db.zadatak.findAll({where:{idZadaca: zadaca[j].idZadaca}});
                    for(k=0; k<zadatak.length; k++){
                        var sz = await db.student_zadatak.findOne({where:{idZadatak: zadatak[k].idZadatak, idStudent: studenti[i].idStudent}});
                        if(sz!==null){
                          bod+= sz.brojOstvarenihBodova ;
                        }
                    }
                  }
                  
                  
                bodovi.push(bod);
                
              }
              res.json(bodovi);
            });
          break;
          case "Ocjena":
              db.predmetStudent.findAll({where:{idPredmet:p.id,idAkademskaGodina:id_godine,ocjena: { [Sequelize.Op.not]: null }}}).then(async ocjene=>{
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
  var precica = req.body.izvjestaj;
  db.sacuvaniIzvjestaji.findOne({ where:{studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId']}}).then((izvjestaj)=>{
    if(izvjestaj == null){
      db.sacuvaniIzvjestaji.create({studentId: precica['studentId'], predmetId:precica['predmetId'], godinaId:precica['godinaId'], naziv:precica['naziv']}).then(()=>{
        res.json({message:"ok"});
      })
    } else {
      res.status(400);
      res.json({message:"Taj izvjestaj je vec sacuvan."});
    }
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
  if(sId !== undefined)
  db.predmetStudent.findAll({ where:{idStudent:sId, ocjena: { [Sequelize.Op.not]: null }}}).then(polozeni=>{
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
else
res.json({message:"Nemate dozvolu pristupa"});
});
app.get("/izvjestaj/ispit/:filter/:predmetId/:godinaId/:datum", function(
  req,
  res
) {
  var IzasloNaIspit;
  var ukupnoStudenata;
  var polozilo;
  var bodovi = [];
  var d = req.params.datum;
  db.predmetStudent.findAll({
      where: {
        idPredmet: req.params.predmetId,
        idAkademskaGodina: req.params.godinaId /*datum_upisa:d*/
      }
    })
    .then(upisano => {
      ukupnoStudenata = upisano.filter(
        a => a.datum_upisa === null || a.datum_upisa >req.params.datum
      );
      db.ispit
        .findAll({
          where: {
            idPredmet: req.params.predmetId,
            tipIspita: req.params.filter,
          }
        })
        .then(ispiti => {
          var ispit = [];
          for(let i=0;i<ispiti.length;i++){
            let d1 = ispiti[i].termin;
            let d2 = new Date(req.params.datum);
            let datum1 = `${d1.getFullYear()}-${d1.getMonth()}-${d1.getDay()}`;
            let datum2 = `${d2.getFullYear()}-${d2.getMonth()}-${d2.getDay()}`;
            if(datum1 == datum2)ispit = [ispiti[0]]
          }
          if (ispit.length === 0) {
            res.json([{ message: "Nema ispita za datum: " + req.params.datum }]);
          } else {
            ispit = ispit[0];
            db.ispitBodovi
              .findAll({ where: { idIspita: ispit.idIspit } })
              .then(rezultati => {
                  IzasloNaIspit = rezultati.length;
                polozilo = rezultati.filter(a => a.bodovi >= 10).length;
              
                for (var i = 0; i < rezultati.length; i++) {
                  bodovi.push(rezultati[i].bodovi);
                }
                res.json([
                  {
                    izasloNaIspit: IzasloNaIspit ,
                    ukupnoStudenata: ukupnoStudenata.length +1,
                    polozilo: polozilo,
                    data: bodovi
                  }
                ]);
              });
          }
        });
    });
  });
  app.get("/predmetiProfesora", function(req,res){
    var pId= url.parse(req.url, true).query['profesorId'];
    let odgovor = { 
      godinaId:0, 
      nazivGodine:"", 
      predmeti: [] };
    db.akademskaGodina.findOne({ where: { aktuelna: "1" } }).then(async rez => {
      if (rez === null) {
        odgovor = { Server: "Nema aktuelne godine" };
        res.json(odgovor);
      } else {
        odgovor.godinaId = rez.id;
        odgovor.nazivGodine = rez.naziv
      }
    });
    db.predmet.findAll({attributes:['id', 'naziv'], where: {idProfesor:pId}}).then(p=>odgovor.predmeti.push(p));
    res.json(odgovor);
  });
app.get('/getPredmetiProfesora',function(req,res){
  let idProfesora  = req.query["profesorId"];
  izlaz =[];
  db.korisnik.findOne({where:{id:idProfesora}}).then(profa=>{
    if(profa === null || profa === undefined)
        res.json({message:"Nepostojeći korisnik!"});
    else{
      db.akademskaGodina.findAll().then(sveAkademskeGodine=>{
        db.predmet.findAll({where:{idProfesor:idProfesora}}).then(sviProfesoroviPredmeti=>{
          for(let i=0;i<sveAkademskeGodine.length;i++){
            let jedinka = {godinaId:'',godinaNaziv:'',predmeti:[]}
            let godina = sveAkademskeGodine[i];
              jedinka.godinaId = godina.id;
              jedinka.godinaNaziv=godina.naziv;
              for(let j=0;j<sviProfesoroviPredmeti.length;j++){
                let element = sviProfesoroviPredmeti[j];
                jedinka.predmeti.push({id:element.id,naziv:element.naziv});
              };
              izlaz.push(jedinka);
          }
          res.send(izlaz);res.end();
        })  

      })
    }
  });
});
//profesorovv dataPredmetPoGodini
app.get('/dataPredmetPoGodini',function(req,res){
  let idProfesora = req.query["profesorId"];
  let idPredmeta = req.query["predmetId"];
  let godinaId = req.query["godinaId"];
  let odg={nazivGodine:"",nazivPredmeta:"",data:[]};
  db.korisnik.findOne({where:{id:idProfesora}}).then(profa=>{
    var a ={imeStudenta:"",prezimeStudenta:"",indeks:"",stavkeOcjenjivanja:[]}
    if(profa === null ||profa === undefined) 
      res.json({message:"Nepostojeći korisnik!"});
    else{
      db.predmet.findAll({where:{idProfesor:idProfesora}}).then(sviProfesoroviPredmeti=>{
        let idPredmeta = [];
        sviProfesoroviPredmeti.forEach(element => {
          idPredmeta.push(element.id);
        });
        db.predmetStudent.findAll({where:{idPredmet:{[Op.in]:idPredmeta}}}).then(sviStudentiNaPredmetu=>{
          let idStudenta=[];
          sviStudentiNaPredmetu.forEach(element => {
            idStudenta.push(element.idStudent);
          });
          db.korisnik.findAll({where:{id:{[Op.in]:idStudenta}}}).then(studenti=>{
            db.akademskaGodina.findOne({where:{aktuelna:true}}).then(trenutnaAkGod=>{
              db.ispit.findAll({where:{idProfesor:idProfesora}}).then(sviProfesoroviIspiti=>{
                let idIspita = [];
                sviProfesoroviIspiti.forEach(element => {
                    idIspita.push(element.idIspit)
                });
              sviStudentiNaPredmetu.forEach(element => {
                
                a.imeStudenta = element.ime;
                a.prezimeStudenta=element.prezime;
                a.indeks = element.indeks;
                let so = [];
                
                  db.ispitBodovi.findAll({where:{idIspita:{[Op.in]:idIspita}}}).then(rezultatiSvihIspita=>{
                    for(let i=0;i<sviStudentiNaPredmetu.length;i++){
                      let id = sviStudentiNaPredmetu[i].id;
                      let stavka = {naziv:"",brojBodova:""};
                      for(let j=0;j<rezultatiSvihIspita;j++){
                        if(rezultatiSvihIspita[j].idKorisnika == sviStudentiNaPredmetu[i].id){
                          sviProfesoroviIspiti.forEach(element => {
                            if(element.idIspit == rezultatiSvihIspita[j].idIspita){
                              stavka.naziv = element.naziv;
                              stavka.brojBodova = rezultatiSvihIspita[j].bodovi;
                            so.push(stavka);
                            }
                          });
                        }

                      }
                      a.stavkeOcjenjivanja = so;
                    }
                   
                  });
                });
                res.json(a);
              });
            });
          });
        });
      });
    }
  })
});
app.get('/svrhe', function(req, res) {
  db.svrha.findAll({attributes:['nazivSvrhe', 'id']}).then((result) => {
        res.json(result);
  });
});

app.get('/izvjestajOSvemu/:profesorId/:predmetId/:godinaId', function(req, res) {
  var predmetId = req.params.predmetId;
  var godinaId = req.params.godinaId;
  var rez={};
  db.predmet.findOne({where: {id: predmetId}}).then(async predmet=>{
    
    db.akademskaGodina.findOne({where: {id: godinaId}}).then(godina=>{
      rez.nazivGodine=godina.naziv;
      rez.nazivPredmeta= predmet.naziv;
      db.ispit.findAll({where: {
        idPredmet: predmet.id,
        termin:{[Op.or]:{[Op.between]:[godina.pocetak_zimskog_semestra,godina.kraj_zimskog_semestra],[Op.between]:[godina.pocetak_ljetnog_semestra,godina.kraj_ljetnog_semestra]}}
      }}).then(ispiti=>{
          db.predmetStudent.findAll({where:{idPredmet:predmetId, idAkademskaGodina:godinaId}}).then(async studenti=>{
            var data=[];
            
            for(var i =0; i<studenti.length; i++){
              var ukupno=0;
              var s =await db.korisnik.findOne({where:{id:studenti[i].idStudent}})
              let dataJedna = {};
              dataJedna.imeStudenta = s.ime;
              dataJedna.prezimeStudenta = s.prezime;
              dataJedna.indeks = s.indeks;
              var stavke=[];
              var zadaca= await db.zadaca.findAll({where:{idPredmet:predmetId}}); 
              var bod=0;
              for(j=0; j<zadaca.length; j++){
                var zadatak = await db.zadatak.findAll({where:{idZadaca: zadaca[j].idZadaca}});
                for(k=0; k<zadatak.length; k++){
                    var sz = await db.student_zadatak.findOne({where:{idZadatak: zadatak[k].idZadatak, idStudent: studenti[i].idStudent}});
                    if(sz!==null){
                      bod+= sz.brojOstvarenihBodova ;
                    }
                }
              }
              stavke.push({naziv: "Zadaca"  , brojBodova:bod});
              ukupno+= bod +10;
              stavke.push({naziv: "Prisustvo", brojBodova:"10" });
              dataJedna.stavkeOcjenjivanja = stavke;
              for(var j=0; j<ispiti.length; j++){
                var ispit = await db.ispitBodovi.findOne({where:{idIspita:ispiti[j].idIspit, idKorisnika:s.id}});
                if(ispit!==null){
                  ukupno+=ispit.bodovi;
                  stavke.push({naziv: ispiti[j].tipIspita + " " + ispiti[j].termin.toString().substr(3,7) , brojBodova:ispit.bodovi});
                }
              }
              stavke.push({naziv: "Ukupno"  , brojBodova:ukupno});
              if(studenti[i].ocjena!==null){
                
                stavke.push({naziv: "Ocjena", brojBodova:studenti[i].ocjena});
              }
              data.push(dataJedna);
            }
            
            rez.data =data;
            res.json(rez);
          })
        })
    })
  })
});

app.post('/kreirajPotvrdu', function(req,res){
  var potvrda= req.body;
  var iag= potvrda.idAkademskeGodine;
  db.akademskaGodina.findOne({where:{aktuelna:'1'}}).then(godina=>{
    if(iag==undefined){
      iag=godina.id;
    }
  db.zahtjevZaPotvrdu.create({idStudenta:potvrda.idStudenta, idSvrhe: potvrda.idSvrhe, idAkademskeGodine: iag, obradjen: 0, datumZahtjeva: Date.now(), besplatna:1 }).then(rezultat=>
  {
    res.json(rezultat);
  }) 
  })
});
app.get("/informacijeZaPotvrdu/:potvrdaId", function(req,res){
   pId= req.params.potvrdaId;
   
   db.zahtjevZaPotvrdu.findOne({where:{id:pId}}).then(potvrda=>{
     db.korisnik.findOne({where:{id: potvrda.idStudenta}}).then(studentp=>{
        var student=[];
        var detaljiOPohadjanju=[];
        student.push({ime:studentp.ime});
        student.push({prezime:studentp.prezime});
        student.push({indeks:studentp.indeks});
        student.push({mjestoRodjenja:studentp.mjestoRodjenja});
        student.push({datumRodjenja:studentp.datumRodjenja});
        student.push({kanton:studentp.kanton});
        student.push({semestar:studentp.semestar});
        student.push({drzavljanstvo:studentp.drzavljanstvo});
         db.akademskaGodina.findOne({where:{aktuelna:'1'}}).then(godina=>{
           detaljiOPohadjanju.push({akademskaGodina: godina.naziv});
           detaljiOPohadjanju.push({ciklus: studentp.ciklus});
           
            db.odsjek.findOne({where:{idOdsjek: studentp.idOdsjek}}).then(odsjek=>{
              detaljiOPohadjanju.push({smjer: odsjek.naziv});
              db.svrha.findOne({where:{id:potvrda.idSvrhe}}).then(svrha=>{
                  res.json({student:student, detaljiOPohadjanju: detaljiOPohadjanju, svrha:svrha.nazivSvrhe, datumObrade:svrha.datumObrade });
              })
                
            })

         })
    
        
     })
   })
});
app.listen(PORT, () => {
  console.log("Server started, listening at port 31912");
});
