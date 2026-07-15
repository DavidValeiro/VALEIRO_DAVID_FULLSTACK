const fs = require('fs');

function ping(req, res, next) {
	const start = Date.now();
	res.on('finish', () => {
		const ms = Date.now() - start;
        fs.appendFile('./logs/request_time.log', `Request processed in ${ms} ms\n timestamp: ${new Date().toISOString()}\n`, (err) => {
            if (err) {
                console.error('Error writing to request_time.log:', err);
            }
        });
	});
	next();
}

module.exports = ping;
