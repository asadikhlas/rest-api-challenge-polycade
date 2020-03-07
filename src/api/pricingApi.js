import { Price } from '../models/price';
import { PricingConfiguration } from '../models/pricingConfiguration';
const defaultPricingModel = require('../../prices.json').default_pricing;

exports.prices = {
	getAllPricing: async ctx => {
		try {
			let foundPricingModels = await Price.findAll({
				include: [
					{
						model: PricingConfiguration,
						as: 'pricing'
					}
				]
			});
			if (!foundPricingModels) {
				foundPricingModels = [];
			}
			foundPricingModels.push(defaultPricingModel);
			ctx.status = 200;
			ctx.body = foundPricingModels;
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	getPriceingById: async ctx => {
		const pricingModelId = ctx.params.pmId;
		try {
			const foundPricingModel = await Price.findByPk(pricingModelId, {
				include: [{ model: PricingConfiguration, as: 'pricing' }]
			});
			if (foundPricingModel) {
				ctx.body = foundPricingModel;
			} else {
				ctx.throw(404, 'Pricing model does not exist.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	getPricingForPricingModel: async ctx => {
		const pricingModelId = ctx.params.pmId;
		try {
			const pricingConfigurations = await PricingConfiguration.findAll({
				// eslint-disable-next-line camelcase
				where: { pricing_id: pricingModelId }
			});
			if (pricingConfigurations) {
				ctx.body = pricingConfigurations;
			} else {
				ctx.throw(404, 'Pricing model does not exist.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	postPricingModel: async ctx => {
		const foundPricingModel = ctx.request.body;
		try {
			const pricingModelInDB = await Price.create(
				{
					name: foundPricingModel.name,
					pricing: foundPricingModel.pricing
				},
				{ include: [{ model: PricingConfiguration, as: 'pricing' }] }
			);
			ctx.status = 201;
			ctx.body = { id: pricingModelInDB.id };
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	addNewPricingConfiguration: async ctx => {
		const pricingModelId = ctx.params.pmId;
		try {
			const foundPricingModel = await Price.findByPk(pricingModelId);
			if (foundPricingModel) {
				const priceConfiguration = ctx.request.body;
				await PricingConfiguration.create({
					name: priceConfiguration.name,
					price: priceConfiguration.price,
					value: priceConfiguration.value,
					// eslint-disable-next-line camelcase
					pricing_id: pricingModelId
				});
				ctx.status = 201;
			} else {
				ctx.throw(404, 'Pricing model does not exist.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	updatePricingById: async ctx => {
		const pricingModelId = ctx.params.pmId;
		try {
			const foundPricingModelFromDB = await Price.findByPk(pricingModelId, {
				include: [{ model: PricingConfiguration, as: 'pricing' }]
			});

			if (foundPricingModelFromDB) {
				const pricingModelFromClient = ctx.request.body;
				await foundPricingModelFromDB.update({
					name: pricingModelFromClient.name
				});
				ctx.body = foundPricingModelFromDB;
			} else {
				ctx.throw(404, 'Pricing model does not exist.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	deletePricingPrice: async ctx => {
		const pricingModelId = ctx.params.pmId;
		try {
			const foundPricingModel = await Price.findByPk(pricingModelId);
			if (foundPricingModel) {
				const priceConfigIdToDelete = ctx.params.priceId;
				const priceConfig = await PricingConfiguration.findByPk(
					priceConfigIdToDelete
				);
				if (!priceConfig) {
					ctx.throw(404, 'Price configuration not found');
					return;
				}
				await priceConfig.destroy();
				ctx.status = 204;
			} else {
				ctx.throw(404, 'Pricing model does not exist.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	}
};
