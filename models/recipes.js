// recipe is for the recipes of the user

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

// recipe schema
const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    // imagePath: String, // if can figure out how to upload image
    description: {
        type: String,
        minlength: 3,
        maxlength: 250
    },
    ingredients: {
        type: [
            {
                quantity: {
                    type: Number,
                    required: false,
                    min: 0,
                    max: 10000
                },
                measurement: {
                    type: String,
                    required: false,
                    minlength: 0,
                    maxlength: 100
                },
                item: {
                    type: String,
                    required: true,
                    minlength: 3,
                    maxlength: 100
                }
            }
        ],
        validate: {
            isAsync: true,
            validator: function(v) {
                return new Promise((resolve, reject) => {
                    const result = v && v.length > 0;
                    resolve(result);
                })
            },
            message: 'At least 1 ingredient must be present.'
        }
    },
    instructions: {
        type: String,
        minlength: 3,
        maxlength: 9999999
    },
    category: [
        {
            _id: String,
            category: String
        }
    ],
    // menu: [
    //     {
    //         _id: String,
    //         meal: String,
    //         date: Date,
    //         time: String
    //     }
    // ],
    // owner: {
    //     type: String,
    //     required: true
    // }
});

// model
const Recipe = new mongoose.model('Recipe', recipeSchema);

// validation function
function validateRecipe(recipe) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(250),
        ingredients: Joi.array().required(),
        instructions: Joi.string().min(3).max(9999999),
        category: Joi.array(),
        // menu: Joi.array(),
        // owner: Joi.objectId().required()
    });

    return schema.validate(recipe);
}

// export
module.exports.Recipe = Recipe;
module.exports.validateRecipe = validateRecipe;