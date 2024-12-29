const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicle: {
        color: { type: String, required: true },
        plate: { type: String, required: true },
        capacity: { type: Number, required: true },
        vehicleType: { type: String, required: true },
    },
    status: { type: String, default: 'active' },
});

// Method to hash password
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Method to generate JWT token
captainSchema.methods.generateAuthToken = function () {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    return jwt.sign({ _id: this._id }, secretKey, { expiresIn: '24h' });
};

module.exports = mongoose.model('Captain', captainSchema);
