const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const IspitBodovi = sequelize.define(
    "IspitBodovi",
    {
      idIspita: Sequelize.INTEGER,
      idKorisnika: Sequelize.INTEGER,
      bodovi: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return IspitBodovi;
};
