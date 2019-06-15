const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
const predmet = sequelize.define("Predmet",{
        idAsistent:Sequelize.INTEGER,
        idProfesor:Sequelize.INTEGER,
        naziv:Sequelize.STRING,
        ects:Sequelize.INTEGER,
        brojPredavanja:Sequelize.INTEGER,
        brojVjezbi:Sequelize.INTEGER,
        opis:Sequelize.STRING
    },
    {freezeTableName:true,
    timestamps:false}
    )
return predmet;
};
