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

//definisanje veza
//1:n
db.korisnik.hasMany(db.zahtjevZaPotvrdu,{foreignKey:'idStudenta', as:"korisnici"});
//1:1
db.zahtjevZaPotvrdu.belongsTo(db.svrha,{foreignKey:'idSvrhe'});

//korisnik-predmet m:n
db.korisnikPredmet = db.korisnik.belongsToMany(db.predmet,{as:'predmeti',through:'predmet_student',foreignKey:'idStudent'});
db.predmet.belongsToMany(db.korisnik,{as:'korisnici',through:'predmet_student',foreignKey:'idPredmet'});
module.exports=db;