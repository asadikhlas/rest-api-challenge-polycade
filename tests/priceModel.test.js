const request = require('supertest');
const server = require('../src/index.js');
const { sequelize: DB } = require('../src/database/database.js');
const { Price } = require('../src/models/price.js');
const {
	PricingConfiguration
} = require('../src/models/pricingConfiguration.js');

const BASE_PREFIX_URL = '/pricing-models';
let PRICING_ID;
let PRICE_CONFIG_ID;

beforeAll(async () => {
	const pricing = await Price.create({
		name: 'it'
	});
	const priceConf = await PricingConfiguration.create({
		name: 'test configuration',
		value: 1,
		cost: 1,
		// eslint-disable-next-line camelcase
		pricing_id: pricing.id
	});
	PRICING_ID = pricing.id;
	PRICE_CONFIG_ID = priceConf.id;
	// do something before anything else runs
	console.log('Jest Tests starting!');
});

describe('GET endpoints of pricing models', () => {
	it('GET /pricing-models all pricing models', async () => {
		const serverResponse = await request(server).get(BASE_PREFIX_URL);
		expect(serverResponse.status).toBe(200);
	});

	it('GET /pricing-models/:pmId pricing model by id with invalid id should return not found', async () => {
		const INVALID_ID = 200;
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${INVALID_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});

	it('GET /pricing-models/:pmId pricing model by id with valid id should return pricing model', async () => {
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${PRICING_ID}`
		);
		expect(serverResponse.status).toBe(200);
		expect(serverResponse.body.name).toBeTruthy();
	});

	it('GET /pricing-models/:pmId/prices pricing configuration for a specific pricing model', async () => {
		const serverResponse = await request(server).get(
			`${BASE_PREFIX_URL}/${PRICING_ID}/prices`
		);
		expect(serverResponse.status).toBe(200);
		expect(serverResponse.body).toBeTruthy();
	});
});

describe('POST /pricing-models endpoints of pricing models', () => {
	it('POST /pricing-models pricing model', async () => {
		const pricingModel = { name: 'Testing Pricing Model' };
		const serverResponse = await request(server)
			.post(BASE_PREFIX_URL)
			.send(pricingModel);
		expect(serverResponse.status).toBe(201);
		expect(serverResponse.body.id).toBeTruthy();
	});

	it('POST /pricing-models/:pmId/prices returns new pricing configuration', async () => {
		const priceConfiguration = {
			price: 10,
			name: 'my configuration',
			value: 100
		};
		const serverResponse = await request(server)
			.post(`${BASE_PREFIX_URL}/${PRICING_ID}/prices`)
			.send(priceConfiguration);
		expect(serverResponse.status).toBe(201);
	});
});

describe('PUT endpoints of pricing models', () => {
	it('PUT /pricing-models/pm:Id returns pricing model', async () => {
		const pricingModel = { name: 'New name', pricing: [-1] };
		const serverResponse = await request(server)
			.put(`${BASE_PREFIX_URL}/${PRICING_ID}`)
			.send(pricingModel);
		expect(serverResponse.body.name).toBe(pricingModel.name);
		expect(serverResponse.body.pricing).not.toBe(pricingModel.pricing);
	});

	it('PUT /pricing-models/pm:Id pricing model as invalid id will return not found', async () => {
		const pricingModel = { name: 'New name', pricing: [-1] };
		const INVALID_ID = 200;
		const serverResponse = await request(server)
			.put(`${BASE_PREFIX_URL}/${INVALID_ID}`)
			.send(pricingModel);
		expect(serverResponse.status).toBe(404);
	});
});

describe('DELETE /pricing-models/:pmId/prices/:priceId endpoints of pricing models', () => {
	it('DELETE /pricing-models/:pmId/prices/:priceId returns pricing model configuration from pricing model', async () => {
		const serverResponse = await request(server).delete(
			`${BASE_PREFIX_URL}/${PRICING_ID}/prices/${PRICE_CONFIG_ID}`
		);
		expect(serverResponse.status).toBe(204);
	});

	it('DELETE /pricing-models/:pmId/prices/:priceId with invalid pmId should return not found', async () => {
		const INVALID_ID = 400;
		const serverResponse = await request(server).delete(
			`${BASE_PREFIX_URL}/${INVALID_ID}/prices/${PRICE_CONFIG_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});

	it('DELETE /pricing-models/:pmId/prices/:priceId with invalid priceId should return not found', async () => {
		const INVALID_ID = 400;
		const serverResponse = await request(server).delete(
			`${BASE_PREFIX_URL}/${PRICE_CONFIG_ID}/prices/${INVALID_ID}`
		);
		expect(serverResponse.status).toBe(404);
	});
});

// close the server and destroy data after all test end
afterAll(async () => {
	await PricingConfiguration.destroy({
		where: { id: PRICE_CONFIG_ID }
	});
	await Price.destroy({ where: { id: PRICING_ID } });
	DB.close();
	server.close();
	console.log('Server Closed');
});
