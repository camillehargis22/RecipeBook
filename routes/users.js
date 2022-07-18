const { User, validateUser, validateAdmin } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET
router.get('/', [auth, admin], async (req, res) => {
    res.send(await User.find().select({ _id: 1, name: 1, email: 1, isAdmin: 1 }));
});

// GET, current user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ _id: 1, name: 1, email: 1 });
    res.send(user);
});

// GET /:id
router.get('/:id', [auth, admin], async (req, res) => {
    // there is something going on here is id is not 12 bytes or 24 hex characters, not sure how to handle error yet

    const user = await User.findById(req.params.id).select({ _id: 1, name: 1, email: 1, isAdmin: 1 });

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

// POST
router.post('/', async (req, res) => {
    // validate user
    const result = validateUser(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // make sure email is not already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    // create new user
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save
    await user.save();

    // create json web token and send user
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

// PUT
router.put('/:id', [auth, admin], async (req, res) => {
    // find user with given id
    let user = await User.findById(req.params.id);

    // if ID not found, return 404
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    // will need a way to distinquish when admin is updating admins, for now will just comment
    // out validateUser while testing Users
    const result = validateAdmin(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // uncomment this when test Account update (may also need to consider another function for account updates for admins)
    // validate user
    // const result = validateUser(req.body);
    // if (result.error) return res.status(400).send(result.error.details[0].message);

    // make sure if email is updated, it is not already registered
    if (user.email !== req.body.email) {
        const userEmail = await User.findOne({ email: req.body.email });
        if (userEmail) return res.status(400).send('User already registerd.');
    }

    // update
    user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        },
        { new: true }
    );

    // rehash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save to db
    await user.save();

    // create new json web token return the updated user
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

// DELETE
router.delete('/:id', [auth, admin], async (req, res) => {
    // find and delete
    const user = await User.findByIdAndRemove(req.params.id);

    // if ID not found, return 404
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    // return deleted user
    res.send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

// export
module.exports = router;