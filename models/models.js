var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:  { type: String, required: true },
  email: { type: String, required: true },
  password:   String
});

mongoose.model('User', userSchema);
