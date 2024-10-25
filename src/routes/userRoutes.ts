import express from 'express'
import checkAuth from '../middlewares/checkAuth';
import { addFriend, getUser, removeFriend, updateUser } from '../controllers/userController';
import { friendValidation, updateUserValidation } from '../validations/user';
import { validateRequest } from '../middlewares/errorHandler';

const userRouter = express.Router();

userRouter.get('/:id', checkAuth, getUser);
userRouter.patch('/update', checkAuth, updateUserValidation, validateRequest, updateUser);
userRouter.post('/add-friend/:friendId', checkAuth, friendValidation, validateRequest, addFriend);
userRouter.post('/remove-friend/:friendId', checkAuth, friendValidation, validateRequest, removeFriend);

export default userRouter;