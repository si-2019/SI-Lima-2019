const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const Zadaca = sequelize.define(
    "Zadaca",
    {
      idZadaca: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      idPredmet: Sequelize.INTEGER,
      naziv: Sequelize.STRING,
      brojZadataka: Sequelize.INTEGER,
      rokZaPredaju: Sequelize.DATE,
      ukupnoBodova: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return Zadaca;
};
