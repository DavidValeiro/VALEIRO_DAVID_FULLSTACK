const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const SALT_ROUNDS = 10;

const isValidId = (id) => mongoose.isValidObjectId(id);

const sanitize = (user) => {
    const { password, ...safe } = user.toObject();
    return safe;
};

async function createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ name, email, password: hashedPassword, is_admin: false });
        const user = await newUser.save();
        res.status(201).json(sanitize(user));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(400).json({ message: err.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getUserById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid user id' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    const { name, email, password, is_admin } = req.body;
    const fields = {};

    if (is_admin !== undefined && !req.user.is_admin) {
        return res.status(403).json({ message: 'Only admins can change is_admin' });
    }

    if (name !== undefined) fields.name = name;
    if (email !== undefined) fields.email = email;
    if (password !== undefined) fields.password = password;
    if (is_admin !== undefined) fields.is_admin = is_admin === true;

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'Nothing to update. Allowed fields: name, email, password, is_admin' });
    }

    if (fields.password !== undefined) {
        if (!fields.password) {
            return res.status(400).json({ message: 'password cannot be empty' });
        }
        try {
            fields.password = await bcrypt.hash(fields.password, SALT_ROUNDS);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, fields, {
            returnDocument: 'after',
            runValidators: true
        });
        res.json(sanitize(updatedUser));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);

        const posts = await Post.find({ author: id }).select('_id');
        const postIds = posts.map((post) => post._id);

        const ownComments = await Comment.find({ user: id }).select('_id post');
        const ownCommentIds = ownComments.map((comment) => comment._id);
        const otherPostIds = [...new Set(
            ownComments.map((comment) => comment.post.toString())
        )].filter((postId) => !postIds.some((id) => id.toString() === postId));

        if (ownCommentIds.length > 0) {
            await Post.updateMany({ _id: { $in: otherPostIds } }, { $pull: { comments: { $in: ownCommentIds } } });
        }

        await Comment.deleteMany({ $or: [{ post: { $in: postIds } }, { user: id }] });
        await Post.deleteMany({ _id: { $in: postIds } });

        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
