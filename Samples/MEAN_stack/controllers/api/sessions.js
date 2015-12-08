var router = require('express').Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../config');

router.post('/', function (req, res, next) {
    User.findOne({ email: req.body.email, password: req.body.password })
    .select('password').select('email')
    .exec(function(err, user) {
        if (err) {
             return next(err);
        }
        if (!user) {
             return res.status(401).send('Incorrect username or password');
        }
        var token = jwt.encode({ email: user.email }, config.secret);
        return res.send(token);
    });
});

module.exports = router;
