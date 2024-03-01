// IMPORT PACKAGES
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {isAuthenticated} = require('./../middleware/jwt.middleware');

// IMPORT MODELS
const User = require('../models/User.model');

const saltRounds = 10;

// ROUTES
// POST - SIGNUP
router.post('/auth/signup', (req, res, next)=>{
    const {name, email, password} = req.body;

    // Check if name/email/passowrd fields are empty
    if ( name === '' || email === '' || password === '' ){
        res.status(400).json({message: "Please provide valid name, email, and password."});
        return;
    }

    // Check email format with Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: "Please provide a valid email address."});
        return;
    }

    // Check the users collection for duplicate email
    User.findOne({email})
    .then((foundUser)=> {
        // Return error if duplicate email found
        if (foundUser) {
            res.status(400).json({message:"User already exists."});
            return;
        }
    })

    // If email is unique, hash password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user in database4
    // Return pending promise, which allows use to chain another 'then'
    return User.create({
        name,
        email,
        password: hashedPassword,
    })
    .then((createdUser)=> {
        // Destructure newly-created user object to omit password
        // NEVER expose passwords directly!
        const {name, email, _id} = createdUser;

        // Create aa new object that doesn't expose the password
        const user = {name, email, _id};

        // Send JSON response containing user object
        res.status(201).json({user: user});
    })
    .catch((err)=> {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error"});
    });
});

// POST - LOGIN
router.post('/auth/login', (req, res, next)=>{
    const {email, password}  = req.body;

    // Check if email/password are empty
    if (email === '' || password === '') {
        res.status(400).json({ message: "Please enter your email and password"});
        return;
    }

    // Check user collection for user email
    User.findOne({ email })
    .then ((foundUser) => {
        if (!foundUser) {
            // Return user not found error
            res.status(401).json({ message: "User not found."})
            return;
        }

        // Compare provided password with database password
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password)

        if (passwordCorrect) {
            // Deconstruct user object to omit password
            const { name, email, _id} = foundUser;

            // Create an object that will be set as the token payload
            const payload = {_id, email, name };

            // Create and sign the token
            const authToken = jwt.sign(
                payload, process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '6h'}
            );

            // Send the token as the response
            res.status(200).json({ authToken });
        } else {
            res.status(401).json({ message: "Unable to authenticate user"});
        }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error"}));
});


// GET - VERIFY
router.get('/auth/verify', isAuthenticated, (req, res, next)=>{
    // If JWT is valid payload gets decoded by isAuthenticated and made available on req.payload
    console.log(`req.payload`, req.payload);

    // Send back object with user data
    // Previously set as the token payload
    res.status(200).json(req.payload);
});




module.exports = router;