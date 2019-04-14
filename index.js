const express = require("express");
var cors = require('cors');

const Sequelize = require('sequelize');
const db = require(__dirname+'/db.js');
const Op = Sequelize.Op;


db.sequelize.sync().then(function(){});
const app = express();
app.use(cors());
app.post('/obrada',async function(req,res){
    let ajdi =req.params.id;
    db.zahtjevZaPotvrdu.update({obradjen:true,datumObrade:Date.now()},{where:{id:ajdi}}).then(rez=>{
        res.end();
    });
});
app.listen(8080);