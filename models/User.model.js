const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const userSchema = new Schema({

  name: {type: String, required: true}, 
  surname: String,
  age: Number, 
  gender: {type: String, enum: ["Male", "Female", "Other"]},
  height: Number,
  weight: Number,
  caloriesGoal: {type: Number, required: true},
  days:  [{type: mongoose.Schema.Types.ObjectId, ref: "Day"}] ,
  meals:  [{type: mongoose.Schema.Types.ObjectId, ref: "Meal"}] 
});

const User = mongoose.model("User", userSchema);

module.exports = User;