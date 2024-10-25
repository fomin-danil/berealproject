import express from 'express'
import { loginValidation, registerValidation } from '../validations/auth';
import { validateRequest } from '../middlewares/errorHandler';
import { loginUser, registerUser } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register', registerValidation, validateRequest, registerUser);
authRouter.post('/login', loginValidation, validateRequest, loginUser);

export default authRouter;