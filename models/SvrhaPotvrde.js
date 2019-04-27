const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
    return sequelize.define("SvrhaPotvrde", {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true 
        },
        nazivSvrhe: {
            type: Sequelize.STRING
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    })
}