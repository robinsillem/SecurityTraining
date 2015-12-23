var Post = require('../../models/post');
var router = require('express').Router();
var ws = require('../../websockets');

router.get('/', function (req, res, next) {
    Post.where('body').regex(new RegExp(req.query.search || "", "i"))
    .sort('-date')
    .exec(function (err, posts) {
        if (err) {
            console.log(err);
            return next(err);
        }
        return res.status(200).json(posts);
    });
});

router.post('/', function (req, res, next) {
    var post = new Post({
        username: req.body.username,
        body: req.body.body
    });
    post.save(function (err, post) {
        if (err) {
            console.log(err);
            return next(err);
        }
        ws.broadcast('new_post', post);
        return res.status(201).json(post);
    });
});

module.exports = router;
