/// IMPORT PACKAGES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

//declare server
const server = express();

//backup dbs vars
const mealBackupJson = require("./Meals.json");
//const userBackupJson = require("./Users.json");

//import models
const Meal = require("./models/Meal.model");
const User = require("./models/User.model");


//mware
server.use(express.json());
server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({ origin: ['http://localhost:5173'] }));

// INITIALIZE SERVER
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});

//connecting server
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

//ROUTES
server.get("/user", (request, response) => {
  response.json({ "name": "Parick", "surname": "Lopez", "age": 42, "gender": "male", "height": 188, "weight": 99, "caloriesGoal": 2100 })
})

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

// Get everything - old
server.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})

// Restore meal database from backup
server.post("/init-db", (req, res) => {
  Meal.insertMany(mealBackupJson)
    .then(mealsArray => res.status(200).json(mealsArray))

    .catch((error) => {
      console.error("404", error);
      res.status(500).json({ error: "Failed to find the meals" });
    });
})

// Edit a meal
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
    }
  })
    .then((updatedMeal) => {
      res.status(200).json(updatedMeal);
    })
    .catch((err) => {
      res.status(500).json({err:"Failed to update meal"});
    })
})

// Post a new Meal
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
  .then((createdMeal)=>{
    res.status(201).json(createdMeal);
  })
  .catch((error)=>{
    res.status(500).json({error:"Failed to add meal to the database"});
  })
})

// Post a new User
server.post("/users", (req, res)=>{
  // console.log(req.body);
  
  const {name, surname, age, gender, height, weight, caloriesGoal} = req.body;
  
  User.create({
    name,
    surname,
    age,
    gender,
    height,
    weight,
    caloriesGoal
  })
  .then((createdUser)=>{
    console.log("User created successfully ->", createdUser);
    res.status(201).json(createdUser);
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({err:"Failed to create user"});
  })
})

// Not Found route
server.get("/*", (req, res) => {
  response.status(404)("This route doesn't exist");

});
