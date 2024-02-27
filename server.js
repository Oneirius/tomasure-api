const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const server = express();

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

server.get("/meals", (request, response)=>{
    response.json([
        {
            "id": 1,
            "name": "Apple",
            "calories": 52,
            "description": "Apples are a popular fruit known for their crisp texture and sweet taste. They are high in fiber and vitamin C.",
            "img": "https://as1.ftcdn.net/v2/jpg/01/76/97/96/1000_F_176979696_hqfioFYq7pX13dmiu9ENrpsHZy1yM3Dt.jpg"
          },
          {
            "id": 2,
            "name": "Banana",
            "calories": 105,
            "description": "Bananas are a tropical fruit with a creamy texture and a sweet flavor. They are a good source of potassium and vitamin B6.",
            "img": "https://5.imimg.com/data5/SELLER/Default/2022/12/EK/NP/CN/49293026/fresh-banana-fruit-500x500.webp"
          },
          {
            "id": 3,
            "name": "Orange",
            "calories": 62,
            "description": "Oranges are citrus fruits known for their tangy flavor and high vitamin C content. They are often eaten fresh or juiced.",
            "img": "https://as1.ftcdn.net/v2/jpg/02/58/86/90/1000_F_258869082_TOHkGzpAyBS0b9nxkZZ5fhtEVaUzO8ch.jpg"
          }
    ])
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
