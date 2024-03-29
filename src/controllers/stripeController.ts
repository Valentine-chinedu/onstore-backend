import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import UIDGenerator from 'uid-generator';

import { Request, Response } from 'express';
import sanitizedConfig from '../config';

const key: string | undefined = sanitizedConfig.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(key, {
	apiVersion: '2020-08-27',
});

const uidgen = new UIDGenerator();

// @desc    payment with stripe
// @route   Post /api/orders/stripe
// @access  Private

export const stripePay = asyncHandler(async (req: Request, res: Response) => {
	const { token, amount } = req.body;
	const idempotencyKey = await uidgen.generate();
	return stripe.customers
		.create({
			email: token?.email,
			source: token,
		})
		.then((customer) => {
			stripe.charges.create(
				{
					amount: amount * 100,
					currency: 'usd',
					customer: customer.id,
					receipt_email: token?.email,
				},
				{ idempotencyKey }
			);
		})
		.then((result) => {
			res.status(200).json(result);
		});
});

// export const stripePay = asyncHandler(async (req: Request, res: Response) => {
// 	const { token, amount } = req.body;
// 	const idempotencyKey = await uidgen.generate();
// 	const customer = await stripe.customers.createSource(token?.customer, {
// 		source: token?.id,
// 	});
// 	const session = await stripe.checkout.sessions.create({
// 		payment_method_types: ['card'],
// 		line_items: [
// 			{
// 				price_data: {
// 					currency: 'usd',
// 					product_data: {
// 						name: 'Payment',
// 					},
// 					unit_amount: amount * 100,
// 				},
// 				quantity: 1,
// 			},
// 		],
// 		mode: 'payment',
// 		customer: customer.id,
// 		success_url: 'http://localhost:3000/success',
// 		cancel_url: 'http://localhost:3000/cancel',
// 	});
// 	res.json({ id: session.id });
// });

export const mobileStripePayment = asyncHandler(
	async (req: any, res: Response) => {
		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: Number(req.body.amount) * 100, //lowest denomination of particular currency
				currency: 'usd',
				payment_method_types: ['card'], //by default
			});

			const clientSecret = paymentIntent.client_secret;

			res.json({
				clientSecret: clientSecret,
			});
		} catch (e: any) {
			console.log(e.message);
			res.json({ error: e.message });
		}
	}
);
