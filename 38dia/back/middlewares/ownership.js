const mongoose = require('mongoose');

const isValidId = (id) => mongoose.isValidObjectId(id);

const sameId = (a, b) => a && b && a.toString() === b.toString();

const requireAuthorOrAdmin = (Model, ownerField) => async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'requireAuth must run before this middleware' });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    try {
        const resource = await Model.findById(id);

        if (!resource) {
            return res.status(404).json({ message: `${Model.modelName} not found` });
        }

        if (!req.user.is_admin && !sameId(resource[ownerField], req.user._id)) {
            return res.status(403).json({ message: `You can only modify your own ${Model.modelName.toLowerCase()}` });
        }

        req.resource = resource;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const requireSelfOrAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'requireAuth must run before this middleware' });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid user id' });
    }

    if (req.user.is_admin || sameId(id, req.user._id)) {
        return next();
    }

    res.status(403).json({ message: 'You can only modify your own user' });
};

module.exports = { requireAuthorOrAdmin, requireSelfOrAdmin };
