const jwt = require('jsonwebtoken');

// Instantiate the JWT validation middleware
const isAuthenticated = (req, res, next) => {
    try {
        // Get token string from auth header
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token
        // Returns payload if token is valid
        // Else throws an error
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);

        // Add payload to the request object as req.payload for use further down the line
        req.payload = payload;

        // Call next() to pass the request to the next middleware function or route
        next();
    } catch (error) {
        res.status(401).json("token not provided or invalid");
    }
}

// Export middleware so that it can be used to create protected routes

module.exports = {
    isAuthenticated
}