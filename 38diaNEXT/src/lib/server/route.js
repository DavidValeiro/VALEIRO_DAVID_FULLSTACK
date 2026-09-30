import { NextResponse } from 'next/server';
import { connectDB } from './db';

export function jsonError(message, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function route(handler) {
  return async (...args) => {
    try {
      await connectDB();
      return await handler(...args);
    } catch (err) {
      console.error('[api]', err);
      return jsonError(err.message || 'Internal server error', 500);
    }
  };
}
