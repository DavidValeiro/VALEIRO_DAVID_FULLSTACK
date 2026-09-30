import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import { isValidId } from '@/lib/server/ownership';
import Post from '@/lib/server/models/post';
import Comment from '@/lib/server/models/comment';
import User from '@/lib/server/models/user';

export const GET = route(async (_request, { params }) => {
  const { id: postId } = await params;

  if (!isValidId(postId)) {
    return jsonError('Invalid post id');
  }

  if (!(await Post.exists({ _id: postId }))) {
    return jsonError('Post not found', 404);
  }

  const comments = await Comment.find({ post: postId }).populate('user', 'name email pokemon');
  return json(comments);
});

export const POST = route(async (request, { params }) => {
  const { id: postId } = await params;

  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const { content } = await request.json().catch(() => ({}));
  if (!content) {
    return jsonError('content is required');
  }

  if (!isValidId(postId)) {
    return jsonError('Invalid post id');
  }

  if (!(await Post.exists({ _id: postId }))) {
    return jsonError('Post not found', 404);
  }

  try {
    const comment = await new Comment({ user: auth.user._id, post: postId, content }).save();

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    await User.findByIdAndUpdate(auth.user._id, { $push: { comments: comment._id } });

    await comment.populate('user', 'name email pokemon');
    return json(comment, 201);
  } catch (err) {
    return jsonError(err.message);
  }
});
