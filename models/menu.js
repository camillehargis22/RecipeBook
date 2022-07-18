const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

// menu schema
const menuSchema = new mongoose.Schema({
    meal: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    time: {
        type: String,
        required: true
    }
});

// model
const Menu = new mongoose.model('Menu', menuSchema);

// validation function
function validateMenu(menu) {
    const schema = Joi.object({
        meal: Joi.string().min(3).max(50).required(),
        date: Joi.date(),
        time: Joi.objectId().required()
    });

    return schema.validate(menu);
}

module.exports.Menu = Menu;
module.exports.menuSchema = menuSchema;
module.exports.validateMenu = validateMenu;