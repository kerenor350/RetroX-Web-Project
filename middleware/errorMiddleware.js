const logger = require("../utils/logger");

function notFoundHandler(req, res) {

    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

    res.status(404).json({

        success: false,
        message: "Route not found."

    });

}

function errorHandler(err, req, res, next) {

    logger.error(
        `Unhandled error: ${req.method} ${req.originalUrl}`,
        err
    );

    res.status(err.status || 500).json({

        success: false,
        message: err.message || "Internal server error."

    });

}

module.exports = {

    notFoundHandler,
    errorHandler

};
