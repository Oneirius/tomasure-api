

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();

const mealBackupJson = require("./Meals.json");

const Meal = require("./models/Meal.model");

const MONGODB_URL = process.env.MONGODB_URL;
mongoose
  .connect(MONGODB_URL)
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));



server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({origin:['http://localhost:5173']}));

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});

server.get("/user", (request, response)=>{
    response.json({"name": "Patrick", "surname":"Lopez", "age": 42, "gender":"male", "height": 188, "weight": 99, "caloriesGoal": 2100})
})

server.get("/meals", (req, res)=>{
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




server.post("/init-db", (req, res) => {
  Meal.insertMany(mealBackupJson)
  .then(mealsArray => res.status(200).json(mealsArray))

  .catch((error) => {
    console.error("404", error);
    res.status(500).json({ error: "Failed to find the meals" });
    });
})





/*
server.get("/days:date", (request, response)=>{
    response.send(console.log("return day meal data here"));
}) */
