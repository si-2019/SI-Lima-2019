const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
const svrha = sequelize.define("SvrhaPotvrde",{
id: { type: Sequelize.INTEGER, primaryKey: true },
nazivSvrhe:Sequelize.STRING
},
{freezeTableName:true,
timestamps:false}
)
return svrha;
};
