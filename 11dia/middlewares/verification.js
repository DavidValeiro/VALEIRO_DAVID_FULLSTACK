function verification(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    if (token == 'mysecrettoken') {
        next();
    } else {
        return res.status(403).send('Forbidden: invalid token');
    }
}
module.exports = verification;