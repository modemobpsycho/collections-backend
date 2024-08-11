import express from 'express';
import {
    getUsers,
    createUser,
    loginUser,
    updateUser,
    getCurrentUser
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.put('/update', updateUser);
userRouter.get('/me', getCurrentUser);

export default userRouter;
