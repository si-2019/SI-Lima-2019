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
db.predmet = sequelize.import(__dirname + "/predmet.js");
db.akademskaGodina = sequelize.import(__dirname + "/akademskaGodina.js");

//definisanje veza
//1:n

//1:1

//korisnik-predmet m:n

module.exports = db;
