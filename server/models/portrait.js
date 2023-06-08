const mongoose = require("mongoose");

const PortraitSchema = new mongoose.Schema({
  _id: String,
  age: Number,
  gender: String,
  occupation: String,
});

// compile model from schema
module.exports = mongoose.model("portrait", PortraitSchema);
