const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  verifiedPhone: {
    type: Boolean,
    required: false,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  verifiedEmail: {
    type: Boolean,
    required: false,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  isDriver: {
    type: Boolean,
    required: true,
    default: false,
  },
  score: {
    type: Number,
    required: false,
    default: 0,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  unionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
