// admin is to validate if the user is an admin
function admin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('Access Denied.');

    next();
}

// I may need to implement this later and on a different file
// (if I decide to implement multiple viewers) owner is to validate if the user is an owner of a recipe
function owner(req, res, next) {
    if (req.body.owner != req.user._id) {
        return res.status(403).send('Access Denied.');
    }

    next();
}

// (if I decide to implement multiple viewers) viewable is to validate if the user has permission to view a recipe

// exports
module.exports = admin;
// module.exports.owner = owner;