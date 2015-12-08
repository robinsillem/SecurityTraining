var router = require('express').Router();
var connection = require('../db/db');

var errmsg = null;

router.get('/', function (req, res) {
    connection.query('SELECT * from posts ORDER BY date DESC', function (err, rows) {
        res.render('posts',
        {
            posts: rows,
            currentUser: req.session.currentUser,
            errmsg: errmsg
        });
    });
});

router.post('/', function (req, res, next) {
    if (!req.session.currentUser) {
        return next('Not authenticated');
    }
    var query = "INSERT INTO posts (username, body, date) VALUES ('" + req.session.currentUser.name + "', '" + req.body.body + "', NOW())";
    console.log(query);
    connection.query(query, function (err) {
        errmsg = null;
        if (err) {
            errmsg = err;
            console.log(err);
        }
    });
    res.redirect('/');
});

module.exports = router;
