const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const isValidId = (id) => mongoose.isValidObjectId(id);

const isValidImage = (image) => {
    if (typeof image !== 'string') return false;

    const value = image.trim();
    if (!value) return false;

    const payload = value.startsWith('data:')
        ? value.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '')
        : value;

    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(payload)) return false;
    if (payload.length % 4 !== 0) return false;

    return Buffer.from(payload, 'base64').length <= MAX_IMAGE_BYTES;
};

async function createPost(req, res) {
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
        return res.status(400).json({ message: 'title, description and image are required' });
    }

    if (!isValidImage(image)) {
        return res.status(400).json({ message: 'image must be a valid Base64 string' });
    }

    try {
        const newPost = new Post({ author: req.user._id, title, description, image: image.trim() });
        const post = await newPost.save();

        await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getPostById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid post id' });
    }

    try {
        const post = await Post.findById(id)
            .populate('author', 'name email')
            .populate('comments');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updatePost(req, res) {
    const { title, description, image } = req.body;
    const fields = {};

    if (image !== undefined && !isValidImage(image)) {
        return res.status(400).json({ message: 'image must be a valid Base64 string' });
    }

    if (title !== undefined) fields.title = title;
    if (description !== undefined) fields.description = description;
    if (image !== undefined) fields.image = image.trim();

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'Nothing to update. Allowed fields: title, description, image' });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.resource._id, fields, {
            returnDocument: 'after',
            runValidators: true
        });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deletePost(req, res) {
    const { author, _id } = req.resource;

    try {
        const comments = await Comment.find({ post: _id }).select('_id user');
        const commentIds = comments.map((comment) => comment._id);
        const authorIds = [...new Set(comments.map((comment) => comment.user.toString()))];

        await Post.findByIdAndDelete(_id);

        await Comment.deleteMany({ post: _id });
        if (commentIds.length > 0) {
            await User.updateMany({ _id: { $in: authorIds } }, { $pull: { comments: { $in: commentIds } } });
        }
        await User.findByIdAndUpdate(author, { $pull: { posts: _id } });

        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};
