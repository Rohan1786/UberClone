const userModel=require('../models/user_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken_model');

module.exports.authuser = async (req, res, next) => {
    try {
        // Extract the token from cookies or the authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        // If no token is found, return unauthorized response
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }
        const isBlackListed = await BlacklistToken.findOne({ token });
        if (isBlackListed) {
            return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database
        const user = await userModel.findById(decoded._id);

        // If the user is not found, return unauthorized response
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach the user to the request object and proceed
        req.user = user;
        return next();
    } catch (err) {
        // Handle token verification or database errors
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
};
