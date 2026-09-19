function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.name === "CastError") {
        return res.status(400).json({ error: "Bad Request", message: "Invalid ID." });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: "Validation Error", message: err.message });
    }

    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: err.message || "Something went wrong."
    });
}

module.exports = errorHandler;