const express=require('express');
const router=express.Router();
const userController=require('../controllers/user_controller')
const {body}=require('express-validator');
const authMiddleware=require('../middleware/auth_middleware')
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
        body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters'),
        body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    ],
    userController.registerUser
);
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('password must 6 character')
],userController.loginUser)

router.get('/profile',authMiddleware.authuser,userController.getUserProfile)
router.get('/logout',authMiddleware.authuser,userController.logoutUser)


module.exports=router;
