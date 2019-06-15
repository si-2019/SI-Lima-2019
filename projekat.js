const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const Projekat = sequelize.define(
    "Projekat",
    {
      idProjekat: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      idKorisnik: Sequelize.INTEGER,
      idPredmet: Sequelize.INTEGER,
      nazivProjekta: Sequelize.STRING,
      progress: Sequelize.FLOAT,
      opisProjekta: Sequelize.STRING,
      moguciBodovi: Sequelize.INTEGER,
      rokProjekta: Sequelize.DATE
    },
    { freezeTableName: true, timestamps: false }
  );
  return Projekat;
};
