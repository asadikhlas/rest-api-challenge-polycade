import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';
import { PricingConfiguration } from './pricingConfiguration';

class Price extends Model {}

Price.init(
	{
		name: DataTypes.STRING
	},
	{ sequelize, modelName: 'price' }
);

Price.hasMany(PricingConfiguration, {
	foreignKey: 'pricing_id',
	sourceKey: 'id',
	as: 'pricing',
	onDelete: 'CASCADE'
});

exports.Price = Price;
