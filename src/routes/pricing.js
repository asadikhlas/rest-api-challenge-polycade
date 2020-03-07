import Router from 'koa-router';
import { prices } from '../api/pricingApi';

const router = new Router({
	prefix: '/pricing-models'
});

router.get('/', prices.getAllPricing);
router.get('/:pmId', prices.getPriceingById);
router.get('/:pmId/prices', prices.getPricingForPricingModel);
router.post('/', prices.postPricingModel);
router.post('/:pmId/prices', prices.addNewPricingConfiguration);
router.put('/:pmId', prices.updatePricingById);
router.delete('/:pmId/prices/:priceId', prices.deletePricingPrice);

module.exports = router;
