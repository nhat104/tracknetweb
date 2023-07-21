import express from 'express';
import { addUser, deleteUser, editUser, getAllUser } from '../controllers/user.js';
import isAuth from '../middlewares/is-auth.js';

const router = express.Router();

router.use(isAuth);

/**
 * @swagger
 * '/auth/signup':
 *  post:
 *    tags:
 *    - auth
 *    summary: Sign Up
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/SignUpInput'
 *    responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignUpResponse'
 */
router.get('/', getAllUser);

/**
 * @swagger
 * '/auth/login':
 *  post:
 *    tags:
 *    - auth
 *    summary: Login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 */
router.post('/', addUser);

router.put('/:userId', editUser);

router.delete('/:userId', deleteUser);

export default router;
