import RequestLog from './models/requestLog';
import User from './models/user';

const WINDOW_MS = 1000;
const MAX_REQUESTS = 2;

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '::1';
}

export async function registerRateLimit(request) {
  const ip = getClientIp(request);
  const windowStart = new Date(Date.now() - WINDOW_MS);

  try {
    const count = await RequestLog.countDocuments({ ip, createdAt: { $gte: windowStart } });

    if (count >= MAX_REQUESTS) {
      console.log(
        `[${new Date().toISOString()}] ${ip} - Abuso de registro detectado (${count + 1} peticiones en ${WINDOW_MS}ms). Que te den.`
      );
      await User.deleteMany({ ip, createdAt: { $gte: windowStart } });
      console.log(`[${new Date().toISOString()}] ${ip} - Usuarios creados en la ventana eliminados.`);
      return { limited: true, message: 'Demasiadas solicitudes. Que te den.', ip };
    }

    await RequestLog.create({ ip });
  } catch (err) {
    console.error('Error en rate limit:', err.message);
  }

  console.log(`[${new Date().toISOString()}] ${ip} - ${request.method} ${request.url}`);
  return { limited: false, ip };
}