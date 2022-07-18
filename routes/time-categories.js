const { TimeCategory, validateTimeCategory } = require('../models/time-category');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', auth, async (req, res) => {
    res.send(await TimeCategory.find().select({ _id: 1, timeCategory: 1, color: 1 }));
});

// GET /:id
router.get('/:id', auth, async (req, res) => {
    // find time category by id
    const timeCategory = await TimeCategory.findById(req.params.id);

    // if not found, send 404
    if (!timeCategory) return res.status(404).send('The time category with the given ID was not found.');

    // send time category
    res.send(_.pick(timeCategory, [ '_id', 'timeCategory', 'color' ]));
});

// POST
router.post('/', auth, async (req, res) => {
    // validate time category
    const result = validateTimeCategory(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // create new time category
    const timeCategory = new TimeCategory({
        timeCategory: req.body.timeCategory,
        color: req.body.color
    });

    // save
    await timeCategory.save();

    // send time category
    res.send(_.pick(timeCategory, [ '_id', 'timeCategory', 'color' ]));
});

// PUT
router.put('/:id', auth, async (req, res) => {
    // validate time category
    const result = validateTimeCategory(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // update time category
    const timeCategory = await TimeCategory.findByIdAndUpdate(
        req.params.id,
        {
            timeCategory: req.body.timeCategory,
            color: req.body.color
        },
        { new: true }
    );

    // if not found, return 404
    if (!timeCategory) return res.status(404).send('The time category with the given ID was not found.');

    // send time category
    res.send(_.pick(timeCategory, [ '_id', 'timeCategory', 'color' ]));
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    // find and delete time category
    const timeCategory = await TimeCategory.findByIdAndRemove(req.params.id);

    // if not found, return 404
    if (!timeCategory) return res.status(404).send('The time category with the given ID was not found.');

    // send time category
    res.send(_.pick(timeCategory, [ '_id', 'timeCategory', 'color' ]));
});

// export
module.exports = router;