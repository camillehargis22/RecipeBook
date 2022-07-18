// user is the information of the user

const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
};

// user schema (validation later)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

// generate user token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

// model
const User = new mongoose.model('User', userSchema);

// validation function
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity(complexityOptions).required(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

// validate change of admin
function validateAdmin(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

// export
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateAdmin = validateAdmin;