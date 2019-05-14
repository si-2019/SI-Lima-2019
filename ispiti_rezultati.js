const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const ispiti_rezultati = sequelize.define("ispiti_rezultati",{
            idIspit:Sequelize.INTEGER,
            idStudent:Sequelize.INTEGER,
            bodovi:Sequelize.INTEGER
        },
        {freezeTableName:true,
        timestamps:false}
        )
    return ispiti_rezultati;
    };
    