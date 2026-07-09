const Post = require("../models/postModel");

// Get all posts
async function getPosts(req, res) {

    try {

        const posts = await Post.find().sort({
            createdAt: -1
        });

        res.json(posts);

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Create new post
async function createPost(req, res) {

    try {

        const post = new Post(req.body);

        await post.save();

        res.status(201).json({

            success: true,
            post

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

}

// Delete post
async function deletePost(req, res) {

    try {

        const post =
            await Post.findByIdAndDelete(
                req.params.id
            );

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found"

            });

        }

        res.json({

            success: true,
            message: "Post deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getPosts,
    createPost,
    deletePost

};