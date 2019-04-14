const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const DB = require('./db.js');
DB.sequelize.sync();

app.get('/brojPodnesenih/:id', function(req, res) {
    let jsonNiz=[];
    DB.zahtjev.count({where:{idStudenta:req.params.id}}).then(c => {
        jsonNiz.push({idStudenta:req.params.id, brojPodnesenih: c});
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(jsonNiz));
      });
});

app.listen(3000);