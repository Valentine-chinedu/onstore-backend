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
exports.getCart = exports.decreaseCartQty = exports.increaseCartQty = exports.emptyCart = exports.removeFromCart = exports.addToCart = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return res.status(404).send('User not found');
        const product = yield productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).send('Product not found');
        const cart = user.carts;
        const index = cart.findIndex((item) => item.productId === productId);
        if (index === -1) {
            user.carts.push({
                productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }
        else {
            user.carts[index].quantity += quantity;
        }
        yield user.save();
        return res.send('Product added to cart');
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return res.status(404).send('User not found');
        const cart = user.carts;
        const index = cart.findIndex((item) => item.productId === productId);
        if (index === -1)
            return res.status(404).send('Product not found in cart');
        user.carts.splice(index, 1);
        yield user.save();
        return res.send('Product removed from cart');
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.removeFromCart = removeFromCart;
const emptyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return res.status(404).send('User not found');
        user.carts = [];
        yield user.save();
        return res.send('Cart emptied');
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.emptyCart = emptyCart;
const increaseCartQty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return res.status(404).send('User not found');
        const cart = user.carts;
        const index = cart.findIndex((item) => item.productId === productId);
        user.carts[index].quantity++;
        yield user.save();
        return res.send('Cart updated');
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.increaseCartQty = increaseCartQty;
const decreaseCartQty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return res.status(404).send('User not found');
        const cart = user.carts;
        const index = cart.findIndex((item) => item.productId === productId);
        user.carts[index].quantity--;
        yield user.save();
        return res.send('Cart updated');
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.decreaseCartQty = decreaseCartQty;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.userId);
        if (!user)
            return res.status(404).send('User not found');
        const cart = user.carts;
        if (!cart)
            return res.status(404).send('Cart not found');
        return res.send(cart);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.getCart = getCart;
