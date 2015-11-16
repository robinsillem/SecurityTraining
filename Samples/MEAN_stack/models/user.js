var db = require('../db');

var user = db.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = db.model('User', user);
