var db = require('../db');

var Log = db.model('Log', {
    origin: { type: String, required: true },
    value: { type: String, required: true },
    type: { type: String, required: true }
});

module.exports = Log;
