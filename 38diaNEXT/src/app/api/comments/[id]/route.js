import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import { isValidId, requireOwner } from '@/lib/server/ownership';
import Comment from '@/lib/server/models/comment';
import Post from '@/lib/server/models/post';
import User from '@/lib/server/models/user';

export const GET = route(async (_request, { params }) => {
  const { id } = await params;

  if (!isValidId(id)) {
    return jsonError('Invalid comment id');
  }

  const comment = await Comment.findById(id).populate('user', 'name email pokemon').populate('post', 'title');
  if (!comment) {
    return jsonError('Comment not found', 404);
  }

  return json(comment);
});

export const PUT = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const owned = await requireOwner(Comment, 'user', id, auth.user);
  if (owned.error) return jsonError(owned.error, owned.status);

  const { content } = await request.json().catch(() => ({}));

  if (content === undefined) {
    return jsonError('Nothing to update. Allowed fields: content');
  }
  if (!content) {
    return jsonError('content cannot be empty');
  }

  const updated = await Comment.findByIdAndUpdate(owned.resource._id, { content }, {
    returnDocument: 'after',
    runValidators: true
  }).populate('user', 'name email pokemon');

  return json(updated);
});

export const DELETE = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const owned = await requireOwner(Comment, 'user', id, auth.user);
  if (owned.error) return jsonError(owned.error, owned.status);

  const { post, user, _id } = owned.resource;

  await Comment.findByIdAndDelete(_id);
  await Post.findByIdAndUpdate(post, { $pull: { comments: _id } });
  await User.findByIdAndUpdate(user, { $pull: { comments: _id } });

  return json({ message: 'Comment deleted' });
});
