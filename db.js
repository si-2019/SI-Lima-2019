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
//definisanje veza
db.korisnik.hasMany(db.zahtjevZaPotvrdu,{foreignKey:'idStudenta', as:"korisnici"});
db.zahtjevZaPotvrdu.belongsTo(db.svrha,{foreignKey:'idSvrhe'});
module.exports=db;