const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// =====================================
// Login
// =====================================

async function login(req, res) {

    try {

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

        const user = await User.findOne({

            username: username.trim()

        });

        if (!user) {

            return res.json({

                success: false,
                message: "Invalid username or password."

            });

        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.json({

                success: false,
                message: "Invalid username or password."

            });

        }

        req.session.loggedIn = true;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({

            success: true,
            message: "Login successful.",
            role: user.role

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Register
// =====================================

async function register(req, res) {

    try {

        const { username, password } = req.body;

        if (!username || username.trim().length < 3) {

            return res.json({

                success: false,
                message: "Username must contain at least 3 characters."

            });

        }

        if (!password || password.trim().length < 4) {

            return res.json({

                success: false,
                message: "Password must contain at least 4 characters."

            });

        }

        const exists = await User.findOne({

            username: username.trim()

        });

        if (exists) {

            return res.json({

                success: false,
                message: "Username already exists."

            });

        }

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        const user = new User({

            username: username.trim(),

            password: hashedPassword,

            role: "user"

        });

        await user.save();

        res.json({

            success: true,
            message: "Account created successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

// =====================================
// Logout
// =====================================

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

    login,
    register,
    logout

};