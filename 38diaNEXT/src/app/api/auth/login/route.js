import bcrypt from 'bcryptjs';
import { json, jsonError, route } from '@/lib/server/route';
import { signToken } from '@/lib/server/auth';
import User from '@/lib/server/models/user';

export const POST = route(async (request) => {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return jsonError('email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    return jsonError('Invalid credentials', 401);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return jsonError('Invalid credentials', 401);
  }

  const { password: _hashed, ...safe } = user.toObject();

  return json({ token: signToken(user), user: safe });
});
