const users = require("../models/userModel");

function login(req, res) {

    const { username, password } = req.body;

    if (!username || username.trim().length < 3) {

        return res.json({
            success: false,
            message: "Username must be at least 3 characters long."
        });

    }

    if (!password || password.trim().length < 4) {

        return res.json({
            success: false,
            message: "Password must be at least 4 characters long."
        });

    }

    const user = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (user) {

        req.session.loggedIn = true;
        req.session.username = username;

        res.json({
            success: true,
            message: "Login successful"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid username or password"
        });

    }

}
function logout(req, res) {

    req.session.destroy((err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Could not logout."
            });

        }

        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

}
module.exports = {
    login,logout
};