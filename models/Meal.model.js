const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const mealSchema = new Schema({

  name: {type: String, required: true}, 
  calories: {type: Number, required: true}, 
  description: String, 
  img: {type: String, default:""},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});



const Meal = mongoose.model("Meal", mealSchema);


module.exports = Meal;