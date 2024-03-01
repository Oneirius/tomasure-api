const router = require('express').Router();
const Day = require("../models/Day.model");
const Meal = require("../models/Meal.model");
const User = require("../models/User.model");

// ROUTES
// POST - NEW MEAL
server.post("/meals/:ownerID", (req, res)=>{
  console.log(req.body);

  const {name, calories, description, img} = req.body;

  Meal.create({
    name,
    calories,
    description,
    img,
    owner: req.params.ownerID
  })
  .then((createdMeal)=>{
    console.log("Meal added ->", createdMeal);
    return User.findByIdAndUpdate(req.params.ownerID, {$push: {meals: createdMeal._id}})
    
  })
  .then((modifiedUser)=>{
    res.status(201).json(modifiedUser);
  })
  .catch((error)=>{
    res.status(500).json({error:"Failed to add meal to the database"});
  })
})

// PUT - EDIT MEAL
server.put("/meals/:mealID", (req, res) => {
    const { mealID } = req.params;
    const { name, calories, description, img, owner } = req.body;
  
    Meal.findById(mealID)
    .then((foundMeal)=>{
      if (foundMeal.owner === owner) {
        Meal.findByIdAndUpdate(mealID, {
          name,
          calories,
          description,
          img,
          owner
        }, {new: true} )
      } else {
          res.status(403).json({err:"No permission to modify meal!"});
        }
    })
      .then((updatedMeal) => {
        res.status(200).json(updatedMeal);
      })
      .catch((err) => {
        res.status(500).json({err:"Failed to update meal"});
      })
  })
  

//*** OLD - Checkout for delete */
// Get all meals -NEW
server.get("/meals", (req, res) => {
    Meal.find({})
      .then((Meals) => {
        console.log("All Meals", Meals);
  
        res.status(200).json(Meals);
      })
      .catch((error) => {
        console.error("Error while retrieving meals ->", error);
        res.status(500).json({ error: "Failed to retrieve meals" });
      });
  })
  
  // Get frequent meals (old)
  server.get("/frequent-meals", (request, response) => {
    response.send([
      {
        "id": 3,
        "name": "Orange Icecream",
        "calories": 620,
        "description": "Oranges are citrus fruits known for their tangy flavor and high vitamin C content. They are often eaten fresh or juiced.",
        "img": "https://as1.ftcdn.net/v2/jpg/02/58/86/90/1000_F_258869082_TOHkGzpAyBS0b9nxkZZ5fhtEVaUzO8ch.jpg"
      }
    ]);
  })
  //*** END checkout for delete */

module.exports = router;