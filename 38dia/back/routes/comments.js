const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const { getCommentById, updateComment, deleteComment } = require('../controllers/comment-controllers');
const { requireAuth } = require('../middlewares/auth');
const { requireAuthorOrAdmin } = require('../middlewares/ownership');

router.get('/:id', getCommentById);
router.put('/:id', requireAuth, requireAuthorOrAdmin(Comment, 'user'), updateComment);
router.delete('/:id', requireAuth, requireAuthorOrAdmin(Comment, 'user'), deleteComment);

module.exports = router;
