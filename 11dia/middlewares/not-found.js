function notFound(req, res, next) {
    res.status(404).send('404 Not Found');
}

module.exports = notFound;