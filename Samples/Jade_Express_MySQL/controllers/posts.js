var router = require('express').Router();
var connection = require('../db/db');

var errmsg = null;

router.get('/', function (req, res) {
    connection.query('SELECT * from posts ORDER BY date DESC', function (err, rows) {
        res.render('posts',
        {
            posts: rows,
            currentUser: req.session.currentUser
        });
    });
});

router.post('/', function (req, res, next) {
    if (!req.session.currentUser) {
        return next('Not authenticated');
    }
    connection.query("INSERT INTO posts (username, body, date) VALUES ('" + req.session.currentUser.name + "', '" + req.body.body + "', NOW())");
    res.redirect('/');
});

module.exports = router;
