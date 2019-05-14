const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const uloga = sequelize.define("Uloga",{
            naziv:Sequelize.STRING
        },
        {freezeTableName:true,
        timestamps:false}
        )
    return uloga;
    };
    