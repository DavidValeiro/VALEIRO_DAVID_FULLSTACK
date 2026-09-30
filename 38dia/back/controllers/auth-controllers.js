const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../middlewares/auth');

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: hashed, ...safe } = user.toObject();

        res.json({
            token: signToken(user),
            user: safe
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { login };
