const logger = require("../utils/logger");

function checkLoginPage(req, res, next) {

    if (!req.session.loggedIn) {

        logger.warn(
            `Unauthorized page access: ${req.method} ${req.originalUrl}`
        );

        return res.redirect("/");

    }

    next();

}

function checkLogin(req, res, next) {

    if (!req.session.loggedIn) {

        logger.warn(
            `Unauthorized API access: ${req.method} ${req.originalUrl}`
        );

        return res.status(401).json({

            success: false,
            message: "Please login first."

        });

    }

    next();

}

function checkAdmin(req, res, next) {

    if (!req.session.loggedIn) {

        logger.warn(
            `Unauthorized admin API access: ${req.method} ${req.originalUrl}`
        );

        return res.status(401).json({

            success: false,
            message: "Please login first."

        });

    }

    if (req.session.role !== "admin") {

        logger.warn(
            `Forbidden admin action by ${req.session.username}: ${req.method} ${req.originalUrl}`
        );

        return res.status(403).json({

            success: false,
            message: "Access denied. Admin only."

        });

    }

    next();

}

module.exports = {

    checkLoginPage,
    checkLogin,
    checkAdmin

};
