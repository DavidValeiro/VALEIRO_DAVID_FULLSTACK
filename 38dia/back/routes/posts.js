const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/post-controllers');
const { getComments, createComment } = require('../controllers/comment-controllers');
const { requireAuth } = require('../middlewares/auth');
const { requireAuthorOrAdmin } = require('../middlewares/ownership');

router.post('/', requireAuth, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', requireAuth, requireAuthorOrAdmin(Post, 'author'), updatePost);
router.delete('/:id', requireAuth, requireAuthorOrAdmin(Post, 'author'), deletePost);
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', requireAuth, createComment);

module.exports = router;
