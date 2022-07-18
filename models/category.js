// category is for the categories of recipes

const Joi = require('joi');
const mongoose = require('mongoose');

// category schema (validation later)
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 35
    }
});

// model
const Category = new mongoose.model('Category', categorySchema);

// validation function
function validateCategory(category) {
    const schema = Joi.object({
        category: Joi.string().min(3).max(35).required()
    });

    return schema.validate(category);
}

// export
module.exports.Category = Category;
module.exports.categorySchema = categorySchema;
module.exports.validateCategory = validateCategory;