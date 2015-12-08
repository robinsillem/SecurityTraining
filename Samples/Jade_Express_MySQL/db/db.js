var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'sec_train_web',
    password : 'web_pass',
    database : 'sec_training',
    multipleStatements: true // Deliberately opening SQLi vulnerability
});

connection.connect();

module.exports = connection;
