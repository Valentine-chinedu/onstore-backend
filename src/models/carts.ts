import { Schema, model, Types } from 'mongoose';

export interface ICarts {
	productId: string;
	quantity: number;
	name: string;
	image: string;
	price: number;
}

const cartsSchema = new Schema<ICarts>(
	{
		productId: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Carts = model<ICarts>('Carts', cartsSchema);

export default Carts;
