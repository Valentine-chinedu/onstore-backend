import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
	isAdmin: boolean;
	carts: Array<{
		productId: string;
		quantity: number;
		name: string;
		image: string;
		price: number;
	}>;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, required: true, default: false },
		carts: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
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
		],
	},
	{
		timestamps: true,
	}
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser>('User', userSchema);

export default User;
