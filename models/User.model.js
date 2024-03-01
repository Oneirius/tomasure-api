const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const userSchema = new Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true}, 
  surname: String,
  age: Number, 
  gender: {type: String, enum: ["Male", "Female", "Other"]},
  height: Number,
  weight: Number,
  caloriesGoal: {type: Number, default: 2000},
  days:  [{type: mongoose.Schema.Types.ObjectId, ref: "Day"}] ,
  meals:  [{type: mongoose.Schema.Types.ObjectId, ref: "Meal"}] 
});

const User = mongoose.model("User", userSchema);

module.exports = User;