const RequestLog = require('../models/requestLog');
const User = require('../models/user');

const windowMs = 1000;
const maxRequests = 2;

function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    return xForwardedFor
        ? xForwardedFor.split(',')[0].trim()
        : req.socket?.remoteAddress || req.ip;
}

async function registerRateLimit(req, res, next) {
    const ip = getClientIp(req);
    req.clientIp = ip;
    const windowStart = new Date(Date.now() - windowMs);

    try {
        const count = await RequestLog.countDocuments({ ip, createdAt: { $gte: windowStart } });

        if (count >= maxRequests) {
            console.log(`[${new Date().toISOString()}] ${ip} - Abuso de registro detectado (${count + 1} peticiones en ${windowMs}ms). Que te den.`);
            await User.deleteMany({ ip, createdAt: { $gte: windowStart } });
            console.log(`[${new Date().toISOString()}] ${ip} - Usuarios creados en la ventana eliminados.`);
            return res.status(429).json({ message: 'Demasiadas solicitudes. Que te den.' });
        }

        await RequestLog.create({ ip });
    } catch (err) {
        console.error('Error en rate limit:', err.message);
    }

    console.log(`[${new Date().toISOString()}] ${ip} - ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = registerRateLimit;