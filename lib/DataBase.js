var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  UniqueCode: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Vote: {
  	type: Number,
  	require: true,
  }
});

var User = mongoose.model('guru', UserSchema);
module.exports.User = User;