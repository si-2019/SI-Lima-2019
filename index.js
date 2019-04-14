const express = require('express');
const app = express();
const Sequelize = require('sequelize');
const DB = require('./db.js');
DB.sequelize.sync();

app.get('/svrhe', function(req, res) {
    DB.svrha.findAll().then((result) => {
        let jsonNiz=[];
        for(let i=0; i<result.length; i++) {
            let jsonObject={id: result[i].idSvrhe, naziv:result[i].nazivSvrhe};
            jsonNiz.push(jsonObject);
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(jsonNiz));
    });
});

app.listen(3000);