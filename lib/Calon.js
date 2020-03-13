var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Vision: {
    type: String,
    required: true,
  },
  Img: {
  	type: String,
  	require: true,
  },
  Jlh: {
    type: Number,
    require: true,
  }
});

var Calon = mongoose.model('calon', UserSchema);
module.exports.Calon = Calon;