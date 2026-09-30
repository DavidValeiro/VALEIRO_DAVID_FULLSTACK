import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import { isValidImage } from '@/lib/server/images';
import Post from '@/lib/server/models/post';
import User from '@/lib/server/models/user';

export const GET = route(async () => {
  const posts = await Post.find().populate('author', 'name email pokemon');
  return json(posts);
});

export const POST = route(async (request) => {
  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);

  const { title, description, image } = await request.json().catch(() => ({}));

  if (!title || !description || !image) {
    return jsonError('title, description and image are required');
  }

  if (!isValidImage(image)) {
    return jsonError('image must be a valid Base64 string');
  }

  try {
    const post = await new Post({
      author: auth.user._id,
      title,
      description,
      image: image.trim()
    }).save();

    await User.findByIdAndUpdate(auth.user._id, { $push: { posts: post._id } });

    const populated = await post.populate('author', 'name email pokemon');
    return json(populated, 201);
  } catch (err) {
    return jsonError(err.message);
  }
});
