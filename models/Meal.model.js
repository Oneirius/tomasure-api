const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const mealSchema = new Schema({
    name: String,
    calories: Number,
    description: String,
    img: String
})

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;