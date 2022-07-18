// time-category is the categories to schedule meal times (breakfast, event, etc.)

const Joi = require('joi');
const mongoose = require('mongoose');

// time-category schema (validation later)
const timeCategorySchema = new mongoose.Schema({
    timeCategory: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    color: {
        type: String, // until figure out how to do colors
        required: true,
        minlength: 3,
        maxlength: 20
    }
});

// model
const TimeCategory = new mongoose.model('TimeCategory', timeCategorySchema);

// validation function
function validateTimeCategory(timeCategory) {
    const schema = Joi.object({
        timeCategory: Joi.string().min(3).max(50).required(),
        color: Joi.string().min(3).max(20).required()
    });

    return schema.validate(timeCategory);
}

// export
module.exports.TimeCategory = TimeCategory;
module.exports.timeCategorySchema = timeCategorySchema;
module.exports.validateTimeCategory = validateTimeCategory;