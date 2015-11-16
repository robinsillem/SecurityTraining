var router = require('express').Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../config');

router.post('/', function(req, res, next) {
    User.findOne({ email: req.body.email })
    .select('password').select('email')
    .exec(function(err, user) {
        if (err) {
             return next(err);
        }
        if (!user) {
            return res.status(401).send('User ' + req.body.email + ' not found');
        }
        if (req.body.password !== user.password) {
             return res.status(401).send('Incorrect password');
        }
        var token = jwt.encode({ email: user.email }, config.secret);
        return res.send(token);
    });
});

module.exports = router;
