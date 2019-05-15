const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const ispit = sequelize.define("Ispit",{
            idIspit:{type:Sequelize.INTEGER,primaryKey:true},
            idProfesor:Sequelize.INTEGER,
            idPredmet:Sequelize.INTEGER,
            brojStudenata:Sequelize.INTEGER,
            tipIspita:Sequelize.STRING,
            rokPrijave:Sequelize.DATE,
            sala:Sequelize.STRING,
            termin:Sequelize.DATE,
            vrijemeTrajanja:Sequelize.INTEGER,
            kapacitet:Sequelize.INTEGER,
            napomena:Sequelize.INTEGER
        },
        {freezeTableName:true,
        timestamps:false}
        )
    return ispit;
    };
    