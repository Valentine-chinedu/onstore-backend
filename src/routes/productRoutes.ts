import express from 'express';
import {
	createProduct,
	deleteProduct,
	getCategoryList,
	getProductByCategory,
	getProductById,
	getProductList,
	getProductSearch,
	updateProduct,
} from '../controllers/productControllers';

import { admin, auth } from '../middleware/auth';
const router = express.Router();

router.route('/').get(getProductList).post(auth, admin, createProduct);
router.route('/categories').get(getCategoryList);
router.route('/:category').get(getProductByCategory);
router.route('/search').get(getProductSearch);
router
	.route('/:id')
	.get(getProductById)
	.put(auth, admin, updateProduct)
	.delete(auth, admin, deleteProduct);

export default router;
