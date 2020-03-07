require('dotenv').config();

exports.config = {
	DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'postgres',
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '123456',
	DATABASE_HOSTNAME: process.env.DATABASE_HOSTNAME || 'localhost',
	DATABASE_NAME: process.env.DATABASE_NAME || 'polycade',
	PORT: process.env.PORT || 1337
};
