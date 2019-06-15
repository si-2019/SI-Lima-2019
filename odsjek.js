const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const ZahtjevZaPotvrdu = sequelize.define("Odsjek",{
        idOdsjek: { type: Sequelize.INTEGER, primaryKey: true },
        naziv:Sequelize.STRING
    },
    {freezeTableName:true,
    timestamps:false}
    )
    return ZahtjevZaPotvrdu;
};