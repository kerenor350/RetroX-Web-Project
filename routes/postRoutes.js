const express = require("express");

const router = express.Router();

const postController =
    require("../controllers/postController");

const {
    checkLogin
} = require("../middleware/authMiddleware");

router.get(
    "/posts",
    checkLogin,
    postController.getPosts
);

router.post(
    "/posts",
    checkLogin,
    postController.createPost
);

router.delete(
    "/posts/:id",
    checkLogin,
    postController.deletePost
);

module.exports = router;
