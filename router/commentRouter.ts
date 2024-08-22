import express from 'express';
import { addComment, deleteComment, getUserComments } from '../controllers/commentController';
import { checkAuth } from '../helpers/checkAuth';

const commentRouter = express.Router();

commentRouter.delete('/', checkAuth, deleteComment);
commentRouter.post(`/:itemId`, checkAuth, addComment);
commentRouter.get('/user/:limit', checkAuth, getUserComments);

export default commentRouter;
