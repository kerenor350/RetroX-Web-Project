const Post = require("../models/postModel");
const logger = require("../utils/logger");

async function getPosts(req, res) {

    try {

        const posts = await Post.find().sort({
            createdAt: -1
        });

        res.json(posts);

    }

    catch (error) {

        logger.error("getPosts failed", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function createPost(req, res) {

    try {

        const title = req.body.title?.trim();
        const content = req.body.content?.trim();
        const author = req.body.author?.trim();
        const movie = req.body.movie?.trim();

        if (!title || !content || !author || !movie) {

            return res.status(400).json({

                success: false,
                message: "Title, content, author, and movie are required."

            });

        }

        const post = new Post({
            title,
            content,
            author,
            movie
        });

        await post.save();

        logger.info(`Review created by ${author} for ${movie}`);

        res.status(201).json({

            success: true,
            post

        });

    }

    catch (error) {

        logger.error("createPost failed", error);

        res.status(400).json({

            success: false,
            message: error.message

        });

    }

}

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

        logger.info(`Review deleted: ${post._id}`);

        res.json({

            success: true,
            message: "Post deleted successfully"

        });

    }

    catch (error) {

        logger.error("deletePost failed", error);

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
