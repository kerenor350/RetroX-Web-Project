function checkLoginPage(req, res, next) {

    if (!req.session.loggedIn) {

        return res.redirect("/");

    }

    next();

}

function checkLogin(req, res, next) {

    if (!req.session.loggedIn) {

        return res.status(401).json({

            success: false,
            message: "Please login first."

        });

    }

    next();

}

function checkAdmin(req, res, next) {

    if (!req.session.loggedIn) {

        return res.status(401).json({

            success: false,
            message: "Please login first."

        });

    }

    if (req.session.role !== "admin") {

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