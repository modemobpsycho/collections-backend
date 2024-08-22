import express from 'express';
import { getTags, getLastTags } from '../controllers/tagController';

const tagRouter = express.Router();

tagRouter.get('/get/:contain/:limit', getTags);
tagRouter.get('/getLast/:limit', getLastTags);

export default tagRouter;
