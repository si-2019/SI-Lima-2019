const Sequelize = require("sequelize");

const sequelize = new Sequelize("TYQcLL35gV", "TYQcLL35gV", "BLysSj9ZrP", {
  host: "remotemysql.com",
  dialect: "mysql",
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela ovdje
db.zahtjevZaPotvrdu = sequelize.import(__dirname + "/zahtjevZaPotvrdu.js");
db.korisnik = sequelize.import(__dirname + "/korisnik.js");
db.svrha = sequelize.import(__dirname + "/svrhaPotvrde.js");
db.predmet = sequelize.import(__dirname + "/predmet.js");
db.ispit = sequelize.import(__dirname + "/ispit.js");
db.ispiti_rezultati = sequelize.import(__dirname + "/ispiti_rezultati.js");
db.uloga = sequelize.import(__dirname + "/uloga.js");
db.ispitBodovi = sequelize.import(__dirname + "/ispitBodovi.js");
db.predmetStudent = sequelize.import(__dirname + "/predmetStudent.js");
db.prisustvoPredavanja = sequelize.import(
  __dirname + "/prisustvoPredavanja.js"
);
db.prisustvoTutorijali = sequelize.import(
  __dirname + "/prisustvoTutorijali.js"
);
db.prisustvoVjezbe = sequelize.import(__dirname + "/prisustvoVjezbe.js");
db.projekat = sequelize.import(__dirname + "/projekat.js");
db.zadaca = sequelize.import(__dirname + "/zadaca.js");
db.akademskaGodina = sequelize.import(__dirname + "/akademskaGodina.js");
db.student_zadatak = sequelize.import(__dirname+"/student_zadatak.js");
db.zadatak = sequelize.import(__dirname+"/zadatak.js");

//definisanje veza
//1:n
db.korisnik.hasMany(db.zahtjevZaPotvrdu, {
  foreignKey: "idStudenta",
  as: "korisnici"
});
db.ispit.hasMany(db.ispiti_rezultati, { foreignKey: "idIspit", as: "ispiti" });

db.predmet.hasMany(db.zadaca, {
  foreignKey: "idPredmet",
  as: "zadace"
});
db.predmet.hasMany(db.ispit, {
  foreignKey: "idPredmet",
  as: "ispiti"
});
db.predmet.hasMany(db.projekat, {
  foreignKey: "idPredmet",
  as: "projekti"
});
db.zadaca.hasMany(db.zadatak,{
  foreignKey: "brojZadatka",
  as:"zadaci"
});
//1:1
db.zahtjevZaPotvrdu.belongsTo(db.svrha, { foreignKey: "idSvrhe" });
db.korisnik.belongsTo(db.uloga, { foreignKey: "idUloga" });
db.predmetStudent.belongsTo(db.predmet, { foreignKey: "idPredmet" });
//korisnik-predmet m:n
db.korisnikPredmet = db.korisnik.belongsToMany(db.predmet, {
  as: "predmeti",
  through: "predmet_student",
  foreignKey: "idStudent"
});
db.predmet.belongsToMany(db.korisnik, {
  as: "korisnici",
  through: "predmet_student",
  foreignKey: "idPredmet"
});
db.ispit.belongsToMany(db.korisnik, {
  as: "studenti",
  through: "ispiti_rezultati",
  foreignKey: "idIspit"
});
db.korisnik.belongsToMany(db.ispit, {
  as: "ispiti",
  through: "ispiti_rezultati",
  foreignKey: "idStudent"
});
module.exports = db;
