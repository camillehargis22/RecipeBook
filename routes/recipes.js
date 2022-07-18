const { Recipe, validateRecipe } = require('../models/recipes');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const { Menu } = require('../models/menu');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', auth, async (req, res) => {
    res.send(await Recipe.find());
});

// GET /:id
router.get('/:id', auth, async (req, res) => {
    // find recipe by id
    const recipe = await Recipe.findById(req.params.id);

    // if not found, send 404
    if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

    // send recipe
    res.send(_.pick(recipe, [ '_id', 'title', 'description', 'ingredients', 'instructions', 'category' ]));
});

// POST
router.post('/', auth, async (req, res) => {
    // validate recipe
    const result = validateRecipe(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate category
    const categories = req.body.category;
    let cats = [];
    for (let i = 0; i < categories.length; i++) {
        const category = await Category.findById(categories[i]._id);
        if (!category) return res.status(400).send('Invalid category or category ID.');
        if (categories[i].category && categories[i].category !== category.category) return res.status(400).send('Invalid category or category ID.');
        cats.push({ _id: category._id, category: category.category });
    }

    // validate menu // depending on how the menu gets implemented, this may only work for one situation instead of the multiple I'm thinking of
    // const meals = req.body.menu;
    // let menu = [];
    // for (let i = 0; i < meals.length; i++) {
    //     const meal = await Menu.findById(meals[i]._id);
    //     if (!meal) return res.status(400).send('Invalid meal ID.');
    //     menu.push({ _id: meal._id, meal: meal.meal, date: meal.date, time: meal.time });
    // }

    // validate owner
    // const user = await User.findById(req.body.owner);
    // if (!user) return res.status(400).send('Owner ID is not valid.');

    // create new recipe
    const recipe = new Recipe({
        title: req.body.title,
        // imagePath: req.body.imagePath,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        category: cats,
        // menu: menu,
        // owner: req.body.owner
    });

    // save
    await recipe.save();

    // send recipe
    res.send(_.pick(recipe, [ '_id', 'title', 'description', 'ingredients', 'instructions', 'category' ]));
});

// PUT
router.put('/:id', auth, async (req, res) => {
    // validate recipe
    const result = validateRecipe(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate category
    const categories = req.body.category;
    let cats = [];
    for (let i = 0; i < categories.length; i++) {
        const category = await Category.findById(categories[i]._id);
        if (!category) return res.status(400).send('Invalid category or category ID.');
        if (categories[i].category && categories[i].category !== category.category) return res.status(400).send('Invalid category or category ID.');
        cats.push({ _id: category._id, category: category.category });
    }

    // validate menu // depending on how the menu gets implemented, this may only work for one situation instead of the multiple I'm thinking of
    // const meals = req.body.menu;
    // let menu = [];
    // for (let i = 0; i < meals.length; i++) {
    //     const meal = await Menu.findById(meals[i]._id);
    //     if (!meal) return res.status(400).send('Invalid meal ID.');
    //     menu.push({ _id: meal._id, meal: meal.meal, date: meal.date, time: meal.time });
    // }

    // validate owner
    // const user = await User.findById(req.body.owner);
    // if (!user) return res.status(400).send('Owner ID is not valid.');

    // update recipe
    const recipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            // imagePath: req.body.imagePath,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            category: cats,
            // menu: menu,
            // owner: req.body.owner
        },
        { new: true }
    );

    // if not found, return 404
    if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

    // send recipe
    res.send(_.pick(recipe, [ '_id', 'title', 'description', 'ingredients', 'instructions', 'category' ]));
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    // find and delete recipe
    const recipe = await Recipe.findByIdAndRemove(req.params.id);

    // if not found, return 404
    if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

    // send recipe
    res.send(_.pick(recipe, [ '_id', 'title', 'description', 'ingredients', 'instructions', 'category' ]));
});

// export
module.exports = router;