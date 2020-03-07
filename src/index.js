import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { config } from '../config/config';
import { sequelize } from './database/database';
import machineRoutes from './routes/machine';
import pricingRoutes from './routes/pricing';
import { health } from './routes/health';
import { Price } from './models/price';
import { PricingConfiguration } from './models/pricingConfiguration';
import { Machine } from './models/machine';

const router = new Router();
const app = new Koa();
app.use(bodyParser());

sequelize
	.authenticate()
	.then(() => {
		console.log('Sequelize ready for business');
	})
	.catch(err => {
		console.error('Could not connect to Database', err);
	});


app.use(machineRoutes.routes());
app.use(pricingRoutes.routes());
router.get('/health', health);
app.use(router.routes());

const server = app.listen(config.PORT, async () => {
	console.log(`🚀 Server listening on port ${config.PORT}`);
	try {
		await Price.sync();
		await PricingConfiguration.sync();
		await Machine.sync();
	} catch (err) {
		console.log(`Sequelize error: ${err.message}`);
	}
});

module.exports = server;
