const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const student_zadatak = sequelize.define(
    "student_zadatak",
    {
      idStudentZadatak: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      idStudent:Sequelize.INTEGER,
      idZadatak: Sequelize.INTEGER,
      brojOstvarenihBodova:Sequelize.INTEGER,
      datumIVrijemeSlanja: Sequelize.DATE,
      velicinaDatoteke:Sequelize.INTEGER,
      komentar: Sequelize.STRING,
      tipDatoteke:Sequelize.STRING,
      datoteka:Sequelize.BLOB,
      stanjeZadatka: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return student_zadatak;
};
