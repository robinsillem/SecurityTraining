var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var winston = require('winston');
var expressWinston = require('express-winston');
var session = require('express-session');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: null }
}));

app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            json: true,
            filename: './logs/request.log'
        })
    ]
}));

app.use('/', require('./controllers/posts'));
app.use('/register', require('./controllers/register'));
app.use('/login', require('./controllers/login'));
app.use(require('./controllers/static'));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            json: true,
            filename: './logs/error.log'
        })
    ]
}));

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

app.get('/logout', function (req, res) {
    delete req.session.currentUser;
    res.redirect('/');
});

app.listen(config.port, function () {
    console.log('Server listening on', config.port);
});