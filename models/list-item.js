// list item is for the list items used on the shopping list

const { boolean } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

// list item schema (validation later)
const listItemSchema = new mongoose.Schema({
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
    },
    selected: {
        type: Boolean,
        required: true,
        default: false
    },
    editable: {
        type: Boolean,
        required: true,
        default: false
    }
});

// model
const ListItem = new mongoose.model('ListItem', listItemSchema);

// validation function
function validateListItem(listItem) {
    const schema = Joi.object({
        quantity: Joi.number().min(0).max(10000),
        measurement: Joi.string().min(0).max(100),
        item: Joi.string().min(3).max(100).required(),
        selected: Joi.boolean(),
        editable: Joi.boolean()
    });

    return schema.validate(listItem);
}

// export
module.exports.ListItem = ListItem;
module.exports.validateListItem = validateListItem;