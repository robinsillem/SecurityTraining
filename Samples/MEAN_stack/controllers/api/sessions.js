var router = require('express').Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../config');

router.post('/', function (req, res, next) {
    var query = { email: req.body.email, password: req.body.password };
    console.log(query);
    User.findOne(query)
    .select('password').select('email')
    .exec(function(err, user) {
        if (err) {
             return next(err);
        }
        console.log(user);
        if (!user) {
             return res.status(401).send('Incorrect username or password');
        }
        var token = jwt.encode({ email: user.email }, config.secret);
        return res.send(token);
    });
});

module.exports = router;
