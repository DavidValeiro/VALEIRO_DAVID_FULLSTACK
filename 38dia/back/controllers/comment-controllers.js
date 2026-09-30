const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

const isValidId = (id) => mongoose.isValidObjectId(id);

async function getComments(req, res) {
    const { postId } = req.params;

    if (!isValidId(postId)) {
        return res.status(400).json({ message: 'Invalid post id' });
    }

    try {
        const postExists = await Post.exists({ _id: postId });
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await Comment.find({ post: postId }).populate('user', 'name email');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getCommentById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid comment id' });
    }

    try {
        const comment = await Comment.findById(id)
            .populate('user', 'name email')
            .populate('post', 'title');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function createComment(req, res) {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'content is required' });
    }

    if (!isValidId(postId)) {
        return res.status(400).json({ message: 'Invalid post id' });
    }

    try {
        const postExists = await Post.exists({ _id: postId });

        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({ user: req.user._id, post: postId, content });
        const comment = await newComment.save();

        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
        await User.findByIdAndUpdate(req.user._id, { $push: { comments: comment._id } });

        await comment.populate('user', 'name email');
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function updateComment(req, res) {
    const { content } = req.body;
    const fields = {};

    if (content !== undefined) fields.content = content;

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'Nothing to update. Allowed fields: content' });
    }

    if (!fields.content) {
        return res.status(400).json({ message: 'content cannot be empty' });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.resource._id, fields, {
            returnDocument: 'after',
            runValidators: true
        }).populate('user', 'name email');

        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deleteComment(req, res) {
    const { post, user, _id } = req.resource;

    try {
        await Comment.findByIdAndDelete(_id);

        await Post.findByIdAndUpdate(post, { $pull: { comments: _id } });
        await User.findByIdAndUpdate(user, { $pull: { comments: _id } });

        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};
