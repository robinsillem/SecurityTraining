var router = require('express').Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../config');

router.get('/', function(req, res, next) {
    if (!req.headers['x-auth']) {
        return res.sendStatus(401);
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    User.findOne({ email: auth.email }, function(err, user) {
        if (err) {
             return next(err);
        }
        res.json(user);
    });
});

router.post('/', function (req, res, next) {
    var user = new User({ email: req.body.email, name: req.body.name, password: req.body.password });
    user.save(function(err) {
        if (err) {
             return next(err);
        }
        res.sendStatus(201);
    });
});

module.exports = router;
