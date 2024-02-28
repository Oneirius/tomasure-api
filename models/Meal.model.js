const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const mealSchema = new Schema({

  name: {type: String, required: true}, 
  calories: {type: Number, required: true}, 
  description: String, 
  img: {type: String, default:""},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;