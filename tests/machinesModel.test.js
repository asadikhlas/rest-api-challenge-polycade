const request = require('supertest');
const server = require('../src/index.js');
const pricingModels = require('../prices.json');
const { sequelize: db } = require('../src/database/database.js');
const { Machine } = require('../src/models/machine.js');
const { Price } = require('../src/models/price.js');
const {
	PricingConfiguration
} = require('../src/models/pricingConfiguration.js');


const BASE_PREFIX_URL = '/machines';
let MACHINE_ID;
let MACHINE_ID_WITHOUT_PRICING;
let PRICING_ID;
let PRICE_CONFIG_ID;

beforeAll(async () => {
	const pricing = await Price.create({
		name: 'Test'
	});
	const priceConf = await PricingConfiguration.create({
		name: 'Test',
		value: 10,
		cost: 100,
		// eslint-disable-next-line camelcase
		pricing_id: pricing.id404
	});
	const machineWithPricing = await Machine.create({
		name: 'Test Machine',
		// eslint-disable-next-line camelcase
		pricing_id: pricing.id
	});
	const machineWithoutPricing = await Machine.create({
		name: 'Test Machine without pricing'
	});
	PRICING_ID = pricing.id;
	PRICE_CONFIG_ID = priceConf.id;
	MACHINE_ID = machineWithPricing.id;
	MACHINE_ID_WITHOUT_PRICING = machineWithoutPricing.id;
	console.log('Jest Testing starting!');
});


describe('System Endpoints', () => {
	it('GET /health should return message OK and status UP ', async () => {
		const serverResponse = await request(server).get('/health');
		expect(serverResponse.status).toBe(200);
		expect(serverResponse.body.status).toBe('UP');
		expect(serverResponse.body.message).toBe('OK');
	});
});


describe('GET endpoints of machines', () => {

	it('GET /machines/:machineId/prices and price configuration', async () => {
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${MACHINE_ID}/prices`
		);
		expect(serverResponse.status).toBe(200);
		expect(serverResponse.body.name).toBeTruthy();
		expect(serverResponse.body.pricing).toBeTruthy();
	});

	it('GET /machines/:machineId/prices returns default pricing model without configuration', async () => {
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${MACHINE_ID_WITHOUT_PRICING}/prices`
		);
		expect(serverResponse.status).toBe(200);
		expect(serverResponse.body).toEqual(pricingModels.default_pricing);
	});

	it('GET /machines/:machineId/prices returns 404 if invalid machine id provided', async () => {
		const INVALID_MACHINE_ID = 200;
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${INVALID_MACHINE_ID}/prices`
		);
		expect(serverResponse.status).toBe(404);
	});

});

describe('PUT endpoints of machines', () => {

	it('PUT /machines/:machineId/prices/priceId to update pricing model', async () => {
		const serverResponse = await request(server).put(
			`${BASE_PREFIX_URL}/${MACHINE_ID}/prices/${PRICING_ID}`
		);
		expect(+serverResponse.body.pricing_id).toBe(PRICING_ID);
	});

	it('PUT /machines/:machineId/prices/priceId should return not found', async () => {
		const INVALID_ID = 1;
		const serverResponse = await request(server).put(
			`${BASE_PREFIX_URL}/${INVALID_ID}/prices/${PRICING_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});

	it('PUT /machines/:machinedId/prices/:pmId with invalid pricingModelId should return not found', async () => {
		const INVALID_ID = 200;
		const serverResponse = await request(server).put(
			`${BASE_PREFIX_URL}/${MACHINE_ID}/prices/${INVALID_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});

});

describe('DELETE endpoints of machines', () => {

	it('DELETE /machines/:machineId/prices/:pmId removes pricing model from machine', async () => {
		const serverResponse = await request(server).delete(
			`${BASE_PREFIX_URL}/${MACHINE_ID}/prices/${PRICING_ID}`
		);
		expect(serverResponse.body.pricing_id).toBeFalsy();
	});

	it('DELETE /machines/:machineId/prices/:pmId returns not found if invalid id is given', async () => {
		const INVALID_ID = 200;
		const serverResponse = await request(server).delete(
			`${BASE_PREFIX_URL}/${INVALID_ID}/prices/${PRICING_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});

});

// Close the server and destroy data after test end
afterAll(async () => {
	await Machine.destroy({ where: { id: MACHINE_ID_WITHOUT_PRICING } });
	await Machine.destroy({ where: { id: MACHINE_ID } });
	await PricingConfiguration.destroy({
		where: { id: PRICE_CONFIG_ID }
	});
	await Price.destroy({ where: { id: PRICING_ID } });
	await db.close();
	server.close();
	console.log('server closed!');
});
