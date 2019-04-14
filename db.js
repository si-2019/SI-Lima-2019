const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV", "TYQcLL35gV", "BLysSj9ZrP", {host:"remotemysql.com", dialect:"mysql"});
const db={};

db.sequelize=sequelize;
db.Sequelize= Sequelize;


db.svrha = sequelize.import(__dirname+"/models/SvrhaPotvrde.js");
db.zahtjev = sequelize.import(__dirname+"/models/ZahtjevZaPotvrdu.js");

db.svrha.hasMany(db.zahtjev, {foreignKey:"idSvrhe"});

module.exports = db;