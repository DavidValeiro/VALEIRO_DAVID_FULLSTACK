import bcrypt from 'bcryptjs';
import { json, jsonError, route } from '@/lib/server/route';
import { getUser } from '@/lib/server/auth';
import User from '@/lib/server/models/user';

const SALT_ROUNDS = 10;

export const GET = route(async (request) => {
  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);
  if (!auth.user.is_admin) return jsonError('Forbidden: admin access required', 403);

  const users = await User.find().select('-password -ip');
  return json(users);
});

export const POST = route(async (request) => {
  const auth = await getUser(request);
  if (auth.error) return jsonError(auth.error, auth.status);
  if (!auth.user.is_admin) return jsonError('Forbidden: admin access required', 403);

  const { name, email, password, is_admin, pokemon } = await request.json().catch(() => ({}));

  if (!name || !email || !password) {
    return jsonError('Nombre, email y contraseña son obligatorios');
  }

  try {
    const user = await new User({
      name,
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, SALT_ROUNDS),
      is_admin: is_admin === true,
      pokemon: pokemon || null
    }).save();

    return json(user, 201);
  } catch (err) {
    if (err.code === 11000) {
      return jsonError('Email already in use', 409);
    }
    return jsonError(err.message, 400);
  }
});