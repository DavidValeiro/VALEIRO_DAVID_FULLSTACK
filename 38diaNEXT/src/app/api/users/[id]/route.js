import bcrypt from 'bcryptjs';
import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import { isValidId, sameId } from '@/lib/server/ownership';
import User from '@/lib/server/models/user';
import Post from '@/lib/server/models/post';
import Comment from '@/lib/server/models/comment';

const SALT_ROUNDS = 10;

export const GET = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);
  if (!auth.user.is_admin && !sameId(id, auth.user._id)) {
    return jsonError('Forbidden: admin access required', 403);
  }

  if (!isValidId(id)) {
    return jsonError('Invalid user id');
  }

  const user = await User.findById(id).select('-password -ip');
  if (!user) {
    return jsonError('User not found', 404);
  }

  return json(user);
});

export const PUT = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);
  if (!auth.user.is_admin && !sameId(id, auth.user._id)) {
    return jsonError('Forbidden: admin access required', 403);
  }
  if (!isValidId(id)) return jsonError('Invalid user id');

  const { name, email, password, is_admin, pokemon } = await request.json().catch(() => ({}));
  const fields = {};

  if (is_admin !== undefined && !auth.user.is_admin) {
    return jsonError('Only admins can change is_admin', 403);
  }

  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email.toLowerCase().trim();
  if (is_admin !== undefined) fields.is_admin = is_admin === true;
  if (pokemon !== undefined) fields.pokemon = pokemon || null;
  if (password) fields.password = await bcrypt.hash(password, SALT_ROUNDS);

  if (Object.keys(fields).length === 0) {
    return jsonError('Nothing to update. Allowed fields: name, email, password, is_admin, pokemon');
  }

  try {
    const updated = await User.findByIdAndUpdate(id, fields, {
      returnDocument: 'after',
      runValidators: true
    }).select('-password -ip');
    if (!updated) return jsonError('User not found', 404);
    return json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return jsonError('Email already in use', 409);
    }
    return jsonError(err.message, 500);
  }
});

export const DELETE = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);
  if (!auth.user.is_admin) return jsonError('Forbidden: admin access required', 403);
  if (!isValidId(id)) return jsonError('Invalid user id');

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return jsonError('User not found', 404);

  const posts = await Post.find({ author: id }).select('_id');
  const postIds = posts.map((post) => post._id);

  const ownComments = await Comment.find({ user: id }).select('_id post');
  const ownCommentIds = ownComments.map((comment) => comment._id);
  const otherPostIds = [
    ...new Set(ownComments.map((comment) => comment.post.toString()))
  ].filter((postId) => !postIds.some((own) => own.toString() === postId));

  if (ownCommentIds.length > 0) {
    await Post.updateMany({ _id: { $in: otherPostIds } }, { $pull: { comments: { $in: ownCommentIds } } });
  }

  await Comment.deleteMany({ $or: [{ post: { $in: postIds } }, { user: id }] });
  await Post.deleteMany({ _id: { $in: postIds } });

  return json({ message: 'User deleted' });
});