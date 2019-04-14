var mysql = require('mysql')
let con = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'TYQcLL35gV',
    password: 'BLysSj9ZrP',
    database: 'TYQcLL35gV'
})
con.connect()


var express = require('express')
var app = express()
app.listen(process.env.PORT || 9123)

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./requests/farisReqs.js')(app, con)


module.exports = app