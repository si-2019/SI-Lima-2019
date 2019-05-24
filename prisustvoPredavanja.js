const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const PrisustvoPredavanja = sequelize.define(
    "PrisustvoPredavanja",
    {
      idStudenta: Sequelize.INTEGER,
      idPredmeta: Sequelize.INTEGER,
      prisutan: Sequelize.BOOLEAN,
      brojSedmice: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return PrisustvoPredavanja;
};
