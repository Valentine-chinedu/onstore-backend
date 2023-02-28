import { Schema, model } from 'mongoose';

interface IProduct {
	name: string;
	image: string;
	price: number;
	category: string;
	description: string;
	qty?: number;

	// _id: string;
}

const productSchema = new Schema<IProduct>(
	{
		name: { type: String, required: true },
		image: { type: String, required: true },
		price: { type: Number, required: true },
		category: { type: String, required: true },
		description: { type: String, required: true },
		qty: { type: Number, required: true },
	},
	{
		timestamps: true,
	}
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
