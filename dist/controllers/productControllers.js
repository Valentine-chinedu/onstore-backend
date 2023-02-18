"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductByCategory = exports.getProductSearch = exports.getCategoryList = exports.getProductList = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const productModel_1 = __importDefault(require("../models/productModel"));
// @desc    Fetch 12 products
// @route   GET /api/products
// @access  Public
exports.getProductList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({}).limit(12);
    if (products) {
        res.status(200).json(products);
    }
    else {
        res.status(500);
        throw new Error('products not found!');
    }
}));
// @desc    Fetch allCategories
// @route   GET /api/products/categories
// @access  Public
exports.getCategoryList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield productModel_1.default.find({}).distinct('category');
    if (categories) {
        res.status(200).json(categories);
    }
    else {
        res.status(500);
        throw new Error('categories not found!');
    }
}));
// @desc   Fetch all products with pages for pagination category brand for filter and searchQuery for search
// @route   GET /api/products/search
// @access  Public
exports.getProductSearch = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.query.pageSize || 8;
    const page = req.query.page || 1;
    const category = req.query.category || '';
    const searchQuery = req.query.query || '';
    const queryFilter = searchQuery && searchQuery !== 'all'
        ? {
            name: {
                $regex: searchQuery,
                $options: 'i',
            },
        }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const categories = yield productModel_1.default.find({}).distinct('category');
    const productDocs = yield productModel_1.default.find(Object.assign(Object.assign({}, queryFilter), categoryFilter))
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();
    const countProducts = yield productModel_1.default.countDocuments(Object.assign(Object.assign({}, queryFilter), categoryFilter));
    res.status(200).json({
        countProducts,
        productDocs,
        categories,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
}));
// @desc    Fetch by category
// @route   GET /api/products/:category
// @access  Public
exports.getProductByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ category: req.params.category });
    if (products) {
        res.status(200).json(products);
    }
    else {
        res.status(400);
        throw new Error('category not found!');
    }
}));
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.id);
    if (product) {
        res.status(200).json(product);
    }
    else {
        res.status(400);
        throw new Error('product not found!');
    }
}));
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, description, category, price, qty } = req.body;
    const product = new productModel_1.default({
        name,
        image,
        description,
        category,
        price,
        qty,
    });
    if (product) {
        const newProduct = yield product.save();
        res.status(201).json(newProduct);
    }
    else {
        res.status(400);
        throw new Error('products not found!');
    }
}));
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findByIdAndUpdate(req.params.id, req.body);
    if (product) {
        res.status(200).json('Product has been updated');
    }
    else {
        res.status(400);
        throw new Error('products not found!');
    }
}));
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.id);
    if (product) {
        yield product.remove();
        res.status(200).json('Product has been deleted');
    }
    else {
        res.status(400);
        throw new Error('products not found!');
    }
}));
// @desc    Create review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, rating } = req.body;
    const product = yield productModel_1.default.findById(req.params.id);
    if (product) {
        const exist = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (exist) {
            res.status(400).json({ message: 'You already reviewed on this product' });
        }
        else {
            const review = {
                name: req.user.name,
                rating,
                comment,
                user: req.user._id,
            };
            product.reviews.push(review);
            yield product.save();
            res.status(201).json(product.reviews);
        }
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
