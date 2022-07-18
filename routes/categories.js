const { Category, validateCategory } = require('../models/category');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', auth, async (req, res) => {
    res.send(await Category.find().select({ _id: 1, category: 1 }));
});

// GET /:id
router.get('/:id', auth, async (req, res) => {
    // find category by id
    const category = await Category.findById(req.params.id);

    // if not found, send 404
    if (!category) return res.status(404).send('The category with the given ID was not found.');

    // send category
    res.send(_.pick(category, [ '_id', 'category' ]));
});

// POST
router.post('/', auth, async (req, res) => {
    // validate category
    const result = validateCategory(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // create new category
    const category = new Category({
        category: req.body.category
    });

    // save
    await category.save();

    // send category
    res.send(_.pick(category, [ '_id', 'category' ]));
});

// PUT
router.put('/:id', auth, async (req, res) => {
    // validate category
    const result = validateCategory(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // update category
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category
        },
        { new: true }
    );

    // if not found, return 404
    if (!category) return res.status(404).send('The category with the given ID was not found.');

    // send category
    res.send(_.pick(category, [ '_id', 'category' ]));
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    // find and delete category
    const category = await Category.findByIdAndRemove(req.params.id);

    // if not found, return 404
    if (!category) return res.status(404).send('The category with the given ID was not found.');

    // send category
    res.send(_.pick(category, [ '_id', 'category' ]));
});

// export
module.exports = router;