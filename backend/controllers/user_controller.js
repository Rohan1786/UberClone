const userModel = require('../models/user_model');
const { validationResult } = require('express-validator');
const userService=require('../services/user_service')
const bcrypt=require('bcrypt');
const blackListToken=require('../models/blacklistToken_model')
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });
        

        const token = user.generateAuthToken();
        res.status(201).json({ token, user });
    } catch (error) {
        next(error);
    }
};


module.exports.loginUser=async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message:"Invalid email and  password"})
    }
 const isMatch=await user.comparePassword(password);

 if(!isMatch){
    return res.status(401).json({message:"Invalid password"})
 }

 const token=user.generateAuthToken();
  res.cookie('token',token)
 res.status(200).json({token,user});
}

module.exports.getUserProfile=async(req,res,next)=>{
    res.status(200).json(req.user);
}


module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token'); // Fixed typo
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        await BlacklistToken.create({ token }); // Blacklist the token
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};