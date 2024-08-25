import express from 'express';
import {
    getAllUsers,
    createUser,
    loginUser,
    loginUserGoogle,
    updateUser,
    getCurrentUser,
    updateUserAdmin,
    deleteUser
} from '../controllers/userController';
import { checkAuth } from '../helpers/checkAuth';

const userRouter = express.Router();

userRouter.get('/', checkAuth, getAllUsers);
userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/login-google', loginUserGoogle);
userRouter.put('/update', checkAuth, updateUser, checkAuth);
userRouter.get('/me', checkAuth, getCurrentUser);
userRouter.delete('/delete', checkAuth, deleteUser);
userRouter.put('/update-admin', checkAuth, updateUserAdmin);

export default userRouter;
