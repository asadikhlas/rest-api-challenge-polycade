import Router from 'koa-router';
import { machine } from '../api/machineApi';

const router = new Router({
	prefix: '/machines'
});

router.get('/:machineId/prices', machine.getMachineById);
router.put('/:machineId/prices/:pmId', machine.updateMachinePricing);
router.delete('/:machineId/prices/:pmId', machine.deleteMachinePricing);

module.exports = router;
