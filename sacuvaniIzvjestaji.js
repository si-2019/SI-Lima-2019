const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const sacuvaniIzvjestaji = sequelize.define(
    "SacuvaniIzvjestaji",
    {
      studentId: Sequelize.INTEGER,
      predmetId: Sequelize.INTEGER,
      naziv: Sequelize.STRING,
      godinaId: Sequelize.INTEGER
    },
    { freezeTableName: true, timestamps: false }
  );
  return sacuvaniIzvjestaji;
};
