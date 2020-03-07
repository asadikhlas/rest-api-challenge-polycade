import Sequelize from 'sequelize';
import { config } from '../../config/config';

const sequelize = new Sequelize(
	config.DATABASE_NAME,
	config.DATABASE_USERNAME,
	config.DATABASE_PASSWORD,
	{
		host: config.DATABASE_HOSTNAME,
		dialect: 'postgres'
	}
);

exports.sequelize = sequelize;
