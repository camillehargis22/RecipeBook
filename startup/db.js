const winston = require('winston');
const mongoose = require('mongoose');

// connect to db
module.exports = function() {
    mongoose.connect('mongodb://localhost/recipe-book')
    .then(() => winston.info('Connected to Recipe Book MongoDB...'));
}