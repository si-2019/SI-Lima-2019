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
db.korisnik = sequelize.import(__dirname + "/korisnik.js");
db.predmet = sequelize.import(__dirname + "/predmet.js");
db.projekat = sequelize.import(__dirname + "/projekat.js");

//definisanje veza
//1:n

db.predmet.hasMany(db.projekat, {
  foreignKey: "idPredmet",
  as: "projekti"
});
//1:1

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
