function notFound(req, res) {
    res.status(404).json({
        error: "Not Found",
        message: `The route ${req.method} ${req.originalUrl} does not exist.`
    });
}

module.exports = notFound;