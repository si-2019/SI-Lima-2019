const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const PrisustvoTutorijali = sequelize.define(
    "PrisustvoTutorijali",
    {
      idStudenta: Sequelize.INTEGER,
      idPredmeta: Sequelize.INTEGER,
      prisutan: Sequelize.BOOLEAN,
      brojSedmice: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return PrisustvoTutorijali;
};
