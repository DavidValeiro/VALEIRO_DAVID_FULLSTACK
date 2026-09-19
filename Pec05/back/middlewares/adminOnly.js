const User = require('../models/user');

function adminOnly(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.is_admin) {
                return res.status(403).json({ message: 'Forbidden: admin access required' });
            }
            next();
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = adminOnly;