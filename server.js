/// IMPORT PACKAGES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const mealBackupJSON = require("./meals.json");

require("dotenv").config();

// IMPORT MODELS
const Meal = require("./models/Meal.model"); 

// CREATE SERVER
const server = express();

// MIDDLEWARE
server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({origin:['http://localhost:5173']}));

// INITIALIZE SERVER
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL

server.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});

mongoose
  .connect(MONGODB_URL)
    .then(x=> console.log(`Connected to Database: "${x.connections[0].name}"`))
    .catch(error => console.error("Error connecting to MongoDB", error));

// INITIALIZE DATABASE
server.post("/initdb", (request, response)=>{
  Meal.insertMany(mealBackupJSON)
  .then(mealsArray => response.status(200).json(mealsArray))
  .catch(error => {
    console.error("Failed to initialize database");
    response.status(500).json({error: "Failed to initialize database"})
  })
})

// DATABASE ROUTES
server.get("/user", (request, response)=>{
    response.json({"name": "Patrick", "surname":"Lopez", "age": 42, "gender":"male", "height": 188, "weight": 99, "caloriesGoal": 2100})
})

server.get("/meals", (request, response)=>{
    Meal.find({})
      .then((Meals)=>{
        console.log(Meals);
        response.status(200).json(Meals);
      })
      .catch((error)=>{
        console.error("Error while retrieving meals");
        response.status(500).json("Error retrieving meals data")
      })
})

 server.get("/frequent-meals", (request, response)=>{
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

server.get("/", (request, response)=>{
    response.sendFile(__dirname +"/views/index.html"); 
})

server.get("/*", (req, res)=> {
    res.status(404).json("This route doesn't exist");
});