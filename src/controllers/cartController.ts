import { Request, Response } from 'express';

import Product from '../models/productModel';
import User from '../models/userModel';

interface IRequest extends Request {
	userId: string;
	productId: string;
	quantity: number;
}

export const addToCart = async (
	req: Request<{}, {}, IRequest>,
	res: Response
) => {
	try {
		const { userId, productId, quantity } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send('User not found');

		const product = await Product.findById(productId);
		if (!product) return res.status(404).send('Product not found');

		const cart = user.carts;
		const index = cart.findIndex((item) => item.productId === productId);

		if (index < 0) {
			user.carts.push({
				productId,
				quantity,
				name: product.name,
				price: product.price,
				image: product.image,
			});
		} else {
			user.carts[index].quantity += quantity;
		}

		await user.save();
		return res.send('Product added to cart');
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};

export const removeFromCart = async (
	req: Request<{}, {}, IRequest>,
	res: Response
) => {
	try {
		const { userId, productId } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send('User not found');

		const cart = user.carts;
		const index = cart.findIndex((item) => item.productId === productId);
		if (index < 0) return res.status(404).send('Product not found in cart');

		user.carts.splice(index, 1);
		await user.save();
		return res.send('Product removed from cart');
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};

export const emptyCart = async (
	req: Request<{}, {}, IRequest>,
	res: Response
) => {
	try {
		const { userId } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send('User not found');

		user.carts = [];
		await user.save();
		return res.send('Cart emptied');
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};

export const increaseCartQty = async (
	req: Request<{}, {}, IRequest>,
	res: Response
) => {
	try {
		const { userId, productId } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send('User not found');

		const cart = user.carts;
		const index = cart.findIndex((item) => item.productId === productId);

		user.carts[index].quantity++;
		await user.save();
		return res.send('Cart updated');
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};

export const decreaseCartQty = async (
	req: Request<{}, {}, IRequest>,
	res: Response
) => {
	try {
		const { userId, productId } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).send('User not found');

		const cart = user.carts;
		const index = cart.findIndex((item) => item.productId === productId);

		user.carts[index].quantity--;
		await user.save();
		return res.send('Cart updated');
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};

export const getCart = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) return res.status(404).send('User not found');

		const cart = user.carts;
		if (!cart) return res.status(404).send('Cart not found');

		return res.send(cart);
	} catch (error: any) {
		return res.status(500).send(error.message);
	}
};
