var express = require('express');
var helpers = require('../helpers');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({msg: 'Authentication Strategy'});
});

router.post('/login', function(req, res, next) {
  var query_obj = {};
  if ('email' in req.body) {
    query_obj.email = req.body.email;
  } else {
    query_obj.username = req.body.username;
  }

  User.findOne(query_obj, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      if (!user) {
        res.send({msg: 'No Such User Found.'});
      } else {
        // check if passwords match
        res.send({token: 'a token'});
      }
    }
  });
});

router.post('/register', function(req, res, next) {
  var user = req.body;
  user.salt = helpers.generateSalt();
  // Prepend salt.
  user.password = helpers.md5(salt + user.password);
  User.create(user, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
});

module.exports = router;
