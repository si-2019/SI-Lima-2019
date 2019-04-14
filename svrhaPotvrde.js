const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
const svrha = sequelize.define("SvrhaPotvrde",{
nazivSvrhe:Sequelize.STRING
},
{freezeTableName:true,
timestamps:false}
)
return svrha;
};
