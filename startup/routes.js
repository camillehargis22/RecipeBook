const express = require('express');
const logger = require('../middleware/logger');
const recipes = require('../routes/recipes');
const users = require('../routes/users');
const categories = require('../routes/categories');
const timeCategories = require('../routes/time-categories');
const listItems = require('../routes/list-items');
const menu = require('../routes/menu');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');

module.exports = function(app) {
    // uses
    app.use(express.json());
        // so the CORS thing doesn't block using frontend and backend together
    // app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', '*');
    //     res.header('Access-Control-Allow-Headers', '*');
    //     next();
    // });
    app.use(cors());
    app.use(function(req, res, next) {
        logger;
        next();
    });
    app.use('/api/recipes', recipes);
    app.use('/api/users', users);
    app.use('/api/categories', categories);
    app.use('/api/timeCategories', timeCategories);
    app.use('/api/listItems', listItems);
    app.use('/api/menu', menu);
    app.use('/api/auth', auth);
    app.use(error);
}