const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const AkademskaGodina = sequelize.define(
    "AkademskaGodina",
    {
      naziv: Sequelize.STRING,
      aktuelna: Sequelize.ENUM("0", "1"),
      pocetak_zimskog_semestra: Sequelize.DATE,
      kraj_zimskog_semestra: Sequelize.DATE,
      pocetak_ljetnog_semestra: Sequelize.DATE,
      kraj_ljetnog_semestra: Sequelize.DATE
    },
    { freezeTableName: true, timestamps: false }
  );
  return AkademskaGodina;
};
