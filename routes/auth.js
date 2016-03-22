var express = require('express');
var helpers = require('../helpers');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jwt-simple');

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
  console.log(req.body);
  User.findOne(query_obj, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      if (!user) {
        console.log('No such user found.');
        res.send({msg: 'Credentials don\'t match.'});
      } else if (helpers.md5(user.salt + req.body.password)
        != user.password) {
        console.log('Passwords do not match.');
        res.send({msg: 'Credentials don\'t match.'});
      } else {
        var secret = process.env.SECRET;
        var temp = {
          exp: Date.now(),
          username: user.username,
          _id: user._id,
          email: user.email
        };
        var token = jwt.encode(temp, secret);
        res.send(token);
      }
    }
  });
});

router.post('/register', function(req, res, next) {
  var user = req.body;
  user.salt = helpers.generateSalt();
  // Prepend salt.
  user.password = helpers.md5(user.salt + user.password);
  User.create(user, function(err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(user);
    }
  });
});

module.exports = router;
