const express = require('express');
const { body } = require('express-validator');
const CaptainController = require('../controllers/captain_controller');

const router = express.Router();

router.post(
    '/register',
    [
        body('fullname.firstname').notEmpty().withMessage('First name is required'),
        body('fullname.lastname').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('vehicle.color')
            .notEmpty()
            .withMessage('Vehicle color is required')
            .isLength({ min: 3 })
            .withMessage('Vehicle color must be at least 3 characters long'),
        body('vehicle.plate')
            .notEmpty()
            .withMessage('Vehicle plate is required')
            .isLength({ min: 4 })
            .withMessage('Vehicle plate must be at least 4 characters long'),
        body('vehicle.capacity').isInt({ gt: 0 }).withMessage('Invalid vehicle capacity'),
        body('vehicle.vehicleType')
            .isIn(['car', 'motorcycle', 'riksha'])
            .withMessage('Invalid vehicle type'),
    ],
    CaptainController.registerCaptain
);

module.exports = router;
