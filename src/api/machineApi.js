import { Price } from '../models/price';
import { Machine } from '../models/machine';
import { PricingConfiguration } from '../models/pricingConfiguration';

const pricingModels = require('../../prices.json');

exports.machine = {
	getMachineById: async ctx => {
		const machineId = ctx.params.machineId;
		try {
			const foundMachine = await Machine.findByPk(machineId);
			if (foundMachine) {
				const pricingMachineId = foundMachine.pricing_id;
				const foundPricingModel = await Price.findByPk(pricingMachineId, {
					include: [{ model: PricingConfiguration, as: 'pricing' }]
				});
				if (foundPricingModel) {
					ctx.body = foundPricingModel;
				} else {
					ctx.body = pricingModels.default_pricing;
				}
			} else {
				ctx.throw(404, 'Machine not found.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	updateMachinePricing: async ctx => {
		const machineId = ctx.params.machineId;
		try {
			const foundMachine = await Machine.findByPk(machineId);
			if (foundMachine) {
				const pricingModelId = ctx.params.pmId;
				const foundPricingModel = await Price.findByPk(pricingModelId);
				if (foundPricingModel) {
					// eslint-disable-next-line camelcase
					await foundMachine.update({ pricing_id: pricingModelId });
					ctx.body = foundMachine;
				} else {
					ctx.throw(404, 'Pricing model not found.');
				}
			} else {
				ctx.throw(404, 'Machine not found.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	},

	deleteMachinePricing: async ctx => {
		const machineId = ctx.params.machineId;
		try {
			const foundMachine = await Machine.findByPk(machineId);
			if (foundMachine) {
				// eslint-disable-next-line camelcase
				await foundMachine.update({ pricing_id: null });
				ctx.body = foundMachine;
			} else {
				ctx.throw(404, 'Machine not found.');
			}
		} catch ({ message }) {
			ctx.throw(404, { success: false, message });
		}
	}
};
