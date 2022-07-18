const { ListItem, validateListItem } = require('../models/list-item');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', auth, async (req, res) => {
    res.send(await ListItem.find().select({ _id: 1, quantity: 1, measurement: 1, item: 1, selected: 1 }));
});

// GET /:id
router.get('/:id', auth, async (req, res) => {
    // find list item by id
    const listItem = await ListItem.findById(req.params.id);

    // if not found, send 404
    if (!listItem) return res.status(404).send('The list item with the given ID was not found.');

    // send list item
    res.send(_.pick(listItem, [ '_id', 'quantity', 'measurement', 'item', 'selected', 'editable' ]));
});

// POST
router.post('/', auth, async (req, res) => {
    // validate list item
    const result = validateListItem(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // create new list item
    const listItem = new ListItem({
        quantity: req.body.quantity,
        measurement: req.body.measurement,
        item: req.body.item,
        selected: req.body.selected,
        editable: req.body.editable
    });

    // save
    await listItem.save();

    // send list item
    res.send(_.pick(listItem, [ '_id', 'quantity', 'measurement', 'item', 'selected', 'editable' ]));
});

// PUT
router.put('/:id', auth, async (req, res) => {
    // validate list item
    const result = validateListItem(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // update list item
    const listItem = await ListItem.findByIdAndUpdate(
        req.params.id,
        {
            quantity: req.body.quantity,
            measurement: req.body.measurement,
            item: req.body.item,
            selected: req.body.selected,
            editable: req.body.editable
        },
        { new: true }
    );

    // if not found, return 404
    if (!listItem) return res.status(404).send('The list item with the given ID was not found.');

    // send list item
    res.send(_.pick(listItem, [ '_id', 'quantity', 'measurement', 'item', 'selected', 'editable' ]));
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    // find and delete recipe
    const listItem = await ListItem.findByIdAndRemove(req.params.id);

    // if not found, return 404
    if (!listItem) return res.status(404).send('The list item with the given ID was not found.');

    // send list item
    res.send(_.pick(listItem, [ '_id', 'quantity', 'measurement', 'item', 'selected', 'editable' ]));
});

// export
module.exports = router;