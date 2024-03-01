const router = require('express').Router();
const Day = require("../models/Day.model");
const Meal = require("../models/Meal.model");
const User = require("../models/User.model");


// ROUTES
// POST - NEW DAY
router.post("/days", (req, res, next) => {
    const { date, meals, owner } = req.body;
    Day.create({ date, meals, owner })
        .then((createdDay) => {
            return User.findByIdAndUpdate(owner, { $push: { days: createdDay._id } })
        })
        .then((updatedUser) => res.json(updatedUser))
        .catch((err) => {
            console.log("error creating new day!", err);
            res.status(500).json({ message: "error while creating new day!" })
        })
})

// PATCH - EDIT DAY
router.patch("/days/:dayId", (req, res, next) => {
    const { meals, totalCalories, owner } = req.body;
    const { dayId, } = req.params
    Day.findByIdAndUpdate(dayId, { meals, totalCalories }, { new: true })
        .then((updatedDay) => res.json(updatedDay))
        .catch((err) => {
            console.log("error updating day!", err);
            res.status(500).json({ message: "error updating day!" })
        })
})

// GET - GET ALL DAYS FOR A SINGLE USER
router.get("/userdays/:userId", (req, res) => {
    const {userId} = req.params;

    Day.find({owner: userId})
    .then ((userDays)=>res.json(userDays))
    .catch((err)=> {
        console.log("Error retrieving user days!");
        res.status(500).json({message: "Error retrieving user days!"});
    });
});


module.exports = router;