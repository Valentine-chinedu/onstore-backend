import express, { Application } from 'express';
import { Server } from 'http';
import connectDb from './config/db';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import cors from 'cors';
import path from 'path';
import sanitizedConfig from './config';
import axios from 'axios';

dotenv.config({
	path: path.resolve(__dirname, '/.env'),
});

connectDb();

//Reloader Function

const url = `https://onstore-server.onrender.com`;
const interval = 300000; // 5 minutes

//Reloader Function

let reloadFailures = 0;
function reloadWebsite() {
	axios
		.get(url)
		.then((response) => {
			reloadFailures = 0;
			console.log(
				`Reloaded at ${new Date().toISOString()}: Status Code ${
					response.status
				}`
			);
		})
		.catch((error) => {
			reloadFailures++;
			console.error(
				`Error reloading at ${new Date().toISOString()} (failure #${reloadFailures}):`,
				error.message
			);
			if (reloadFailures >= 3) {
				console.error(
					'Reloader has failed 3 times in a row. Check server status or network connection.'
				);
				reloadFailures = 0;
			}
		});
}

setInterval(reloadWebsite, interval);

const app: Application = express();

if (sanitizedConfig.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT: number | string = sanitizedConfig.PORT || 1337;

const server: Server = app.listen(PORT, () =>
	console.log(
		`🟢 Server running in ${sanitizedConfig.NODE_ENV} mode on port ${PORT}`
	)
);
