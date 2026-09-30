import bcrypt from 'bcryptjs';
import { json, jsonError, route } from '@/lib/server/route';
import { registerRateLimit } from '@/lib/server/rateLimit';
import User from '@/lib/server/models/user';

const SALT_ROUNDS = 10;
const DEFAULT_POKEMON = { id: 132, name: 'ditto', shiny: false };

export const POST = route(async (request) => {
  const limit = await registerRateLimit(request);
  if (limit.limited) return jsonError(limit.message, 429);

  const { name, email, password, pokemon } = await request.json().catch(() => ({}));

  if (!name || !email || !password) {
    return jsonError('Nombre, email y contraseña son obligatorios');
  }

  try {
    const user = await new User({
      name,
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, SALT_ROUNDS),
      is_admin: false,
      ip: limit.ip,
      pokemon: pokemon || DEFAULT_POKEMON
    }).save();

    return json(user, 201);
  } catch (err) {
    if (err.code === 11000) {
      return jsonError('Email already in use', 409);
    }
    return jsonError(err.message, 400);
  }
});