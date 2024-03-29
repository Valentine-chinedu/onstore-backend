import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel';

// @desc    Fetch 12 products
// @route   GET /api/products
// @access  Public
export const getProductList = asyncHandler(
	async (req: Request, res: Response) => {
		const products = await Product.find({});

		if (products) {
			res.status(200).json(products);
		} else {
			res.status(500);
			throw new Error('products not found!');
		}
	}
);

// @desc    Fetch allCategories
// @route   GET /api/products/categories
// @access  Public

export const getCategoryList = asyncHandler(
	async (req: Request, res: Response) => {
		const categories = await Product.find({}).distinct('category');

		if (categories) {
			res.status(200).json(categories);
		} else {
			res.status(500);
			throw new Error('categories not found!');
		}
	}
);

// @desc   Fetch all products with pages for pagination category brand for filter and searchQuery for search
// @route   GET /api/products/search
// @access  Public

export const getProductSearch = asyncHandler(
	async (req: Request, res: Response) => {
		const pageSize: any = req.query.pageSize || 8;
		const page: any = req.query.page || 1;

		const category = req.query.category || '';
		const searchQuery = req.query.query || '';

		const queryFilter =
			searchQuery && searchQuery !== 'all'
				? {
						name: {
							$regex: searchQuery,
							$options: 'i',
						},
				  }
				: {};
		const categoryFilter = category && category !== 'all' ? { category } : {};

		const categories = await Product.find({}).distinct('category');
		const productDocs = await Product.find({
			...queryFilter,
			...categoryFilter,
		})
			.skip(pageSize * (page - 1))
			.limit(pageSize)
			.lean();

		const countProducts = await Product.countDocuments({
			...queryFilter,
			...categoryFilter,
		});

		res.status(200).json({
			countProducts,
			productDocs,
			categories,
			page,
			pages: Math.ceil(countProducts / pageSize),
		});
	}
);

// @desc    Fetch by category
// @route   GET /api/products/:category
// @access  Public

export const getProductByCategory = asyncHandler(
	async (req: Request, res: Response) => {
		const products = await Product.find({ category: req.params.category });

		if (products) {
			res.status(200).json(products);
		} else {
			res.status(400);
			throw new Error('category not found!');
		}
	}
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public

export const getProductById = asyncHandler(
	async (req: Request, res: Response) => {
		const product = await Product.findById(req.params.id);

		if (product) {
			res.status(200).json(product);
		} else {
			res.status(400);
			throw new Error('product not found!');
		}
	}
);

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin

export const createProduct = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, image, description, category, price, qty } = req.body;
		const product = new Product({
			name,
			image,
			description,
			category,
			price,
			qty,
		});

		if (product) {
			const newProduct = await product.save();
			res.status(201).json(newProduct);
		} else {
			res.status(400);
			throw new Error('products not found!');
		}
	}
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

export const updateProduct = asyncHandler(
	async (req: Request, res: Response) => {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body);

		if (product) {
			res.status(200).json('Product has been updated');
		} else {
			res.status(400);
			throw new Error('products not found!');
		}
	}
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

export const deleteProduct = asyncHandler(
	async (req: Request, res: Response) => {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.remove();
			res.status(200).json('Product has been deleted');
		} else {
			res.status(400);
			throw new Error('products not found!');
		}
	}
);
