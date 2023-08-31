const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
