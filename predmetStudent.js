const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const PredmetStudent = sequelize.define(
    "predmet_student",
    {
      idStudent: Sequelize.INTEGER,
      idPredmet: Sequelize.INTEGER,
      idAkademskaGodina: Sequelize.INTEGER,
      ocjena: Sequelize.INTEGER,
      datum_upisa: Sequelize.DATE
    },
    { freezeTableName: true, timestamps: false }
  );
  return PredmetStudent;
};
