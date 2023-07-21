import express from 'express';
import { getAllLog } from '../controllers/log.js';
import isAuth from '../middlewares/is-auth.js';

const router = express.Router();

router.use(isAuth);

router.get('/', getAllLog);

// router.post()

export default router;
