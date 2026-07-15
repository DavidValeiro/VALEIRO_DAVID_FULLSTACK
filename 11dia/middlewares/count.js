let requestCount = 0;
const fs = require('fs');

function countRequest(req, res, next) {
	requestCount += 1;
	req.requestCount = requestCount;
	fs.appendFile('./logs/request_count.log', `Request count: ${requestCount}\n timestamp: ${new Date().toISOString()}\n`, (err) => {
		if (err) {
			console.error('Error writing to request_count.log:', err);
		}
		next();
	});
}

module.exports = countRequest;
