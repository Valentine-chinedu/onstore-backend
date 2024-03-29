import express from 'express';
import {
	deleteUser,
	getUserBydId,
	getUsersList,
	login,
	promoteAdmin,
	register,
	updatrUserProfile,
} from '../controllers/userControllers';

import { admin, auth } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getUsersList);
router.route('/promote/:id').post(auth, admin, promoteAdmin);
router
	.route('/:id')
	.get(getUserBydId)
	.delete(auth, admin, deleteUser)
	.put(auth, updatrUserProfile);
router.route('/register').post(register);
router.route('/login').post(login);

export default router;
