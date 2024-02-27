const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require ('mongoose')
const Meal = require("./models/Meals.model");
const mealBackupJson = require ("./meals")


require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

const server = express();

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({origin:['http://localhost:5173']}));

server.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});

mongoose
    .connect(MONGODB_URL)
    .then(response => console.log(`Connected to Mongo! Database name: "${response.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongo", err));

server.post("/initDB", (req, res) => {
  Meal.insertMany(mealBackupJson)
  .then(mealsArray => res.status(200).json(mealsArray))
  .catch((error) => {
    console.error("Error while creating the file", error);
    res.status(500).json({ error: "Failed to delete the book" });
});
})



server.get("/user", (request, response)=>{
    response.json({"name": "Patrick", "surname":"Lopez", "age": 42, "gender":"male", "height": 188, "weight": 99, "caloriesGoal": 2100})
})

server.get("/meals", (request, response)=>{
   Meal.find()
   .then((meals) => {
    console.log('all meals', meals)
    response.status(200).json(meals);
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
    response.status(404)("This route doesn't exist");
});
/*
server.get("/days:date", (request, response)=>{
    response.send(console.log("return day meal data here"));
}) */
