const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const ispiti_rezultati = sequelize.define("ispiti_rezultati",{
            idIspit:{type:Sequelize.INTEGER,primaryKey:true},
            idStudent:{type:Sequelize.INTEGER,primaryKey:true},
            bodovi:Sequelize.INTEGER
        },
        {freezeTableName:true,
        timestamps:false}
        )
    return ispiti_rezultati;
    };
    