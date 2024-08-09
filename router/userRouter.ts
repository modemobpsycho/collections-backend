import express from 'express';
import { getUsers, createUser, loginUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);

export default userRouter;
