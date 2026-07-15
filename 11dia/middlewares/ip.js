const fs = require('fs');
const path = require('path');

function blockIp(req, res, next) {
    const blockedIps = ['192.168.1.100'];
    const clientIp = req.ip || req.connection.remoteAddress;
    if (blockedIps.includes(clientIp)) {
        return res.status(403).send('Access denied');
    }
    next();
}

function saveIpToFile(req, res, next) {
    const logFilePath = path.join(__dirname, '../logs/ips.log');
    const clientIp = req.ip || req.connection.remoteAddress;
    fs.appendFileSync(logFilePath, `${clientIp} - ${new Date().toISOString()}\n`);
    next();
}

module.exports = { blockIp, saveIpToFile };
