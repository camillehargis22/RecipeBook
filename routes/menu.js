const { Menu, validateMenu } = require('../models/menu');
const { TimeCategory } = require('../models/time-category');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', auth, async (req, res) => {
    res.send(await Menu.find());
});

// GET /:id
router.get('/:id', auth, async (req, res) => {
    // find recipe by id
    const menu = await Menu.findById(req.params.id);

    // if not found, send 404
    if (!menu) return res.status(404).send('The menu with the given ID was not found.');

    // send recipe
    res.send(menu);
});

// POST
router.post('/', auth, async (req, res) => {
    // validate recipe
    const result = validateMenu(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validation for valid timeCategory
    const timeCategory = await TimeCategory.findById(req.body.time);
    if (!timeCategory) return res.status(400).send('Invalid time category ID.');

    // create new recipe
    const menu = new Menu({
        meal: req.body.meal,
        date: req.body.date,
        time: {
            _id: timeCategory._id,
            timeCategory: timeCategory.timeCategory
        }
    });

    // save
    await menu.save();

    // send recipe
    res.send(menu);
});

// PUT
router.put('/:id', auth, async (req, res) => {
    // validate recipe
    const result = validateMenu(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validation for valid timeCategory
    const timeCategory = await TimeCategory.findById(req.body.time);
    if (!timeCategory) return res.status(400).send('Invalid time category ID.');

    // update recipe
    const menu = await Menu.findByIdAndUpdate(
        req.params.id,
        {
            meal: req.body.meal,
            date: req.body.date,
            time: {
                _id: timeCategory._id,
                timeCategory: timeCategory.timeCategory
        }
        },
        { new: true }
    );

    // if not found, return 404
    if (!menu) return res.status(404).send('The menu with the given ID was not found.');

    // send recipe
    res.send(menu);
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    // find and delete recipe
    const menu = await Menu.findByIdAndRemove(req.params.id);

    // if not found, return 404
    if (!menu) return res.status(404).send('The menu with the given ID was not found.');

    // send recipe
    res.send(menu);
});

// export
module.exports = router;