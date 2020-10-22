const mongoose = require("mongoose");

// create schema for specific dv
const UserSchema = new mongoose.Schema({
  name: {
    type: String, // type
    required: true, // complusory YES
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    //attach profile to email
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("user", UserSchema);
//User is variable name,
