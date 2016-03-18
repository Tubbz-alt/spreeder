var mongoose = require('mongoose');
var Log = require('log');
var log = new Log('mongoose');
var models = require('./models');

var url = process.env.MONGO_URL;
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', function(err) {
  log.error(err);
});

db.once('open', function() {
  log.info('mongoose connected');
});

module.exports = db;
