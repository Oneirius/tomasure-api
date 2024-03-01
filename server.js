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

// IMPORT MODELS
const Meal = require("./models/Meal.model");
const User = require("./models/User.model");

// MIDDLEWARE
server.use(express.json());
server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({ origin: ['http://localhost:5173'] }));


// IMPORT ROUTES
const dayRoutes = require("./routes/day.routes");
const mealRoutes = require("./routes/meal.routes");

server.use("/", mealRoutes);
server.use("/", dayRoutes);

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


// GET - API INFO PAGE
server.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})

// POST - RESTORE DATABASE FROM BACKUP
// TO-DO: Add a delete everything call in here
server.post("/init-db", (req, res) => {
  Meal.insertMany(mealBackupJson)
  .then(mealsArray => res.status(200).json(mealsArray))
  
  .catch((error) => {
    console.error("404", error);
    res.status(500).json({ error: "Failed to find the meals" });
  });
})


// OLD - GET USER // TO-DO: Checkout for deletion
server.get("/user", (request, response) => {
  response.json({ "name": "Parick", "surname": "Lopez", "age": 42, "gender": "male", "height": 188, "weight": 99, "caloriesGoal": 2100 })
})

// POST - CREATE A NEW USER
// TO-DO: REFACTOR
server.post("/users", (req, res)=>{
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

// GET - NOT FOUND PAGE
server.get("/*", (req, res) => {
  res.status(404).json({message:"This route doesn't exist"});
});
