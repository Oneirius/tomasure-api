const express = require('express');
const router = require('express').Router();
const Day = require("../models/Day.model");
const Meal = require("../models/Meal.model");
const User = require("../models/User.model");

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

module.exports = router

