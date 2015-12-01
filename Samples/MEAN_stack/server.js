var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var config = require('./config');
var winston = require('winston');
var expressWinston = require('express-winston');
var ws = require('./websockets');

var app = express();
app.use(bodyParser.json());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            json: true,
            filename: './logs/request.log'
        })
    ]
}));

app.use('/api/posts', require('./controllers/api/posts'));
app.use('/api/sessions', require('./controllers/api/sessions'));
app.use('/api/users', require('./controllers/api/users'));
app.use(require('./controllers/static'));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            json: true,
            filename: './logs/error.log'
        })
    ]
}));

var credentials = {
    key: fs.readFileSync('./mean_stack-key.pem'),
    cert: fs.readFileSync('./mean_stack-cert.pem')
};

var httpServer = http.createServer(app);
httpServer.listen(config.port, function () {
    console.log('Server listening on', config.port);
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.tlsport, function () {
    console.log('Server listening securely on', config.tlsport);
});

ws.connect(httpServer, config.port);
ws.connect(httpsServer, config.tlsport);
