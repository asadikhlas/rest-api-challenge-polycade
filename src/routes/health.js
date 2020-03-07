exports.health = function (ctx) {
	const healthCheck = {
		uptime: process.uptime(),
		message: 'OK',
		status: 'UP',
		timestamp: Date.now()
	};
	ctx.body = healthCheck;
};
