const windowMs = 15 * 1000;
const maxRequests = 2;
const ipRequests = new Map();

function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    return xForwardedFor
        ? xForwardedFor.split(',')[0].trim()
        : req.socket?.remoteAddress || req.ip;
}

function registerRateLimit(req, res, next) {
    const ip = getClientIp(req);
    const now = Date.now();

    const timestamps = ipRequests.get(ip) || [];
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
        console.log(`[${new Date().toISOString()}] ${ip} - Abuso de registro detectado (${recent.length + 1} peticiones en ${windowMs}ms). Que te den.`);
        return res.status(429).json({ message: 'Demasiadas solicitudes. Que te den.' });
    }

    recent.push(now);
    ipRequests.set(ip, recent);

    console.log(`[${new Date().toISOString()}] ${ip} - ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = registerRateLimit;