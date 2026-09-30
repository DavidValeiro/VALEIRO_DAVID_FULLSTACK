require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const signToken = (user) => jwt.sign(
    { sub: user._id.toString(), is_admin: user.is_admin === true },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
);

async function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or malformed Authorization header' });
    }

    const token = header.slice('Bearer '.length).trim();

    if (!token) {
        return res.status(401).json({ message: 'Missing or malformed Authorization header' });
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        return res.status(401).json({ message });
    }

    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { requireAuth, signToken };
