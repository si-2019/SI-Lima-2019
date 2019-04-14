const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
    return sequelize.define("ZahtjevZaPotvrdu", {
        idZahtjev: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true
        },
        idStudenta: {
            type: Sequelize.INTEGER
        },
        idSvrhe: {
            type: Sequelize.INTEGER
        },
        obradjen: {
            type: Sequelize.BOOLEAN
        },
        datumZahtjeva: {
            type: Sequelize.DATE
        },
        datumObrade: {
            type: Sequelize.DATE
        },
        besplatna: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    })
}