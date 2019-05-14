const Sequelize= require("sequelize");

const sequelize = new Sequelize("TYQcLL35gV", "TYQcLL35gV", "BLysSj9ZrP", {
    host:"remotemysql.com", 
    dialect:"mysql",
    logging:false});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela ovdje
db.zahtjevZaPotvrdu = sequelize.import(__dirname+"/zahtjevZaPotvrdu.js");
db.korisnik = sequelize.import(__dirname+"/korisnik.js");
db.svrha = sequelize.import(__dirname+"/svrhaPotvrde.js");
db.predmet = sequelize.import(__dirname+"/predmet.js");
db.ispit = sequelize.import(__dirname+"/ispit.js");
db.ispiti_rezultati = sequelize.import(__dirname+"/ispiti_rezultati.js");
db.uloga=sequelize.import(__dirname+"/uloga.js");

//definisanje veza
//1:n
db.korisnik.hasMany(db.zahtjevZaPotvrdu,{foreignKey:'idStudenta', as:"korisnici"});
db.ispit.hasMany(db.ispiti_rezultati,{foreignKey:'idIspit',as:"ispiti"});

//1:1
db.zahtjevZaPotvrdu.belongsTo(db.svrha,{foreignKey:'idSvrhe'});
db.korisnik.belongsTo(db.uloga,{foreignKey:'idUloga'});

//korisnik-predmet m:n
db.korisnikPredmet = db.korisnik.belongsToMany(db.predmet,{as:'predmeti',through:'predmet_student',foreignKey:'idStudent'});
db.predmet.belongsToMany(db.korisnik,{as:'korisnici',through:'predmet_student',foreignKey:'idPredmet'});
module.exports=db;