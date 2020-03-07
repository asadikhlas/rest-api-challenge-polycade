import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';
import {Price} from './price';

class Machine extends Model {}

Machine.init(
	{
		name: DataTypes.STRING
	},
	{ sequelize, modelName: 'machine' }
);

Machine.belongsTo(Price, {
	foreignKey: 'pricing_id'
});

exports.Machine = Machine;
