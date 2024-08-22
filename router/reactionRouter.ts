import express from 'express';
import { setReaction, getUserReactions } from '../controllers/reactionController';
import { checkAuth } from '../helpers/checkAuth';

const reactionRouter = express.Router();

reactionRouter.post('/:itemId', checkAuth, setReaction);
reactionRouter.get('/user/:limit', checkAuth, getUserReactions);

export default reactionRouter;
