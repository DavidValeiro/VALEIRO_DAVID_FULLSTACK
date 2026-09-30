import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import { isValidId, requireOwner } from '@/lib/server/ownership';
import { isValidImage } from '@/lib/server/images';
import Post from '@/lib/server/models/post';
import User from '@/lib/server/models/user';
import Comment from '@/lib/server/models/comment';

export const GET = route(async (_request, { params }) => {
  const { id } = await params;

  if (!isValidId(id)) {
    return jsonError('Invalid post id');
  }

  const post = await Post.findById(id).populate('author', 'name email pokemon').populate('comments');
  if (!post) {
    return jsonError('Post not found', 404);
  }

  return json(post);
});

export const PUT = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const owned = await requireOwner(Post, 'author', id, auth.user);
  if (owned.error) return jsonError(owned.error, owned.status);

  const { title, description, image } = await request.json().catch(() => ({}));
  const fields = {};

  if (image !== undefined && !isValidImage(image)) {
    return jsonError('image must be a valid Base64 string');
  }

  if (title !== undefined) fields.title = title;
  if (description !== undefined) fields.description = description;
  if (image !== undefined) fields.image = image.trim();

  if (Object.keys(fields).length === 0) {
    return jsonError('Nothing to update. Allowed fields: title, description, image');
  }

  const updated = await Post.findByIdAndUpdate(owned.resource._id, fields, {
    returnDocument: 'after',
    runValidators: true
  });

  return json(await updated.populate('author', 'name email pokemon'));
});

export const DELETE = route(async (request, { params }) => {
  const { id } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const owned = await requireOwner(Post, 'author', id, auth.user);
  if (owned.error) return jsonError(owned.error, owned.status);

  const post = owned.resource;
  const comments = await Comment.find({ post: post._id }).select('_id user');
  const commentIds = comments.map((comment) => comment._id);
  const authorIds = [...new Set(comments.map((comment) => comment.user.toString()))];

  await Post.findByIdAndDelete(post._id);
  await Comment.deleteMany({ post: post._id });

  if (commentIds.length > 0) {
    await User.updateMany({ _id: { $in: authorIds } }, { $pull: { comments: { $in: commentIds } } });
  }
  await User.findByIdAndUpdate(post.author, { $pull: { posts: post._id } });

  return json({ message: 'Post deleted' });
});
