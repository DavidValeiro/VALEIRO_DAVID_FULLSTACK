import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import User from './models/user';

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('Falta la variable de entorno JWT_SECRET (revisa tu .env.local)');
  }
  return value;
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), is_admin: user.is_admin === true }, secret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret());
  } catch (err) {
    return {
      error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      status: 401
    };
  }
}

export async function getUser(request) {
  const header = request.headers.get('authorization') || '';

  if (!header.startsWith('Bearer ')) {
    return { error: 'Missing or malformed Authorization header', status: 401 };
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return { error: 'Missing or malformed Authorization header', status: 401 };
  }

  const payload = verifyToken(token);
  if (payload.error) return payload;

  await connectDB();
  const user = await User.findById(payload.sub);
  if (!user) {
    return { error: 'User no longer exists', status: 401 };
  }

  return { user };
}
