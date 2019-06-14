const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const ZahtjevZaPotvrdu = sequelize.define("ZahtjevZaPotvrdu",{
        idStudenta: Sequelize.INTEGER,
        idSvrhe:Sequelize.INTEGER,
        idAkademskeGodine:Sequelize.INTEGER,
        obradjen:Sequelize.BOOLEAN,
        datumZahtjeva:Sequelize.DATE,
        datumObrade: Sequelize.DATE,
        besplatna:Sequelize.BOOLEAN
    },
    {freezeTableName:true,
    timestamps:false}
    )
    return ZahtjevZaPotvrdu;
};