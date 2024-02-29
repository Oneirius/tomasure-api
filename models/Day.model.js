const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const daySchema = new Schema({

  date: {type: String, required: true}, 
  totalCalories: {type: Number, required: true, default: 0}, 
  owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  meals: [{type: mongoose.Schema.Types.ObjectId, ref: "Meal"}] 
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;