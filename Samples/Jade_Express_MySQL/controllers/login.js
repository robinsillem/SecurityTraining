var router = require('express').Router();
var connection = require('../db/db');

var errmsg = null;

router.get('/', function (req, res) {
    res.render('login',
    {
        errmsg: errmsg,
        currentUser: req.session.currentUser
    });
    errmsg = null;
});

router.post('/', function (req, res, next) {
    connection.query("SELECT * from users WHERE email = '" + req.body.email + "'", function (err, rows) {
        if (err) {
            return next(err);
        } 
        if (rows.length !== 1) {
            errmsg = 'User ' + req.body.email + ' not found';
            return res.redirect('/login');
        }
        if (rows[0].password !== req.body.password) {
            errmsg = 'Incorrect password';
            return res.redirect('/login');

        }
        req.session.currentUser = { email: rows[0].email, name: rows[0].name };
        return res.redirect('/');
    });
});

module.exports = router;
