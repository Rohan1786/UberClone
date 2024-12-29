
const captainModel = require('../models/captain_model');
const captainService = require('../services/captain_service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptainAlreadyExists = await captainModel.findOne({ email });
        if (isCaptainAlreadyExists) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        const token = captain.generateAuthToken();

        res.status(201).json({
            message: 'Captain registered successfully',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                vehicle: captain.vehicle,
                status: captain.status,
            },
        });
    } catch (error) {
        console.error('Error registering captain:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
