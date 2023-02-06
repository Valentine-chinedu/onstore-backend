import express from 'express';
import {
	addToCart,
	decreaseCartQty,
	emptyCart,
	getCart,
	increaseCartQty,
	removeFromCart,
} from '../controllers/cartController';

const router = express.Router();

router.route('/').get(getCart);
router.route('/add').post(addToCart);
router.route('/remove').delete(removeFromCart);
router.route('/empty').delete(emptyCart);
router.route('/increase').put(increaseCartQty);
router.route('/decrease').put(decreaseCartQty);

export default router;
