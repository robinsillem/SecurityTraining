var router = require('express').Router();
var User = require('../../models/user');
var jwt = require('jwt-simple');
var config = require('../../config');

router.post('/', function(req, res, next) {
    User.findOne({ username: req.body.username })
    .select('password').select('username')
    .exec(function(err, user) {
        if (err) { return next(err); }
        if (!user) { return res.sendStatus(401); }
        if (req.body.password !== user.password) { return res.sendStatus(401); }
        var token = jwt.encode({ username: user.username }, config.secret);
        return res.send(token);
    });
});

module.exports = router;
