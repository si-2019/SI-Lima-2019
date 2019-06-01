const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const zadatak = sequelize.define(
    "Zadatak",
    {
      idZadatak: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      idZadaca: Sequelize.INTEGER,
      redniBrojZadatkaUZadaci:Sequelize.INTEGER,
      maxBrojBodova: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return zadatak;
};
