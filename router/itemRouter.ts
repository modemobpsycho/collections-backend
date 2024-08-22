import express from 'express';
import {
    addItem,
    getAllItems,
    getItem,
    deleteItem,
    updateItem,
    getLastItems,
    searchItems
} from '../controllers/itemController';
import { checkAuth } from '../helpers/checkAuth';

const itemRouter = express.Router();

itemRouter.get('/all/:collectionId', getAllItems);
itemRouter.get('/:itemId', getItem);
itemRouter.post('/:collectionId', checkAuth, addItem);
itemRouter.delete('/:itemId', checkAuth, deleteItem);
itemRouter.put('/:itemId', checkAuth, updateItem);
itemRouter.get('/getLast/:limit', getLastItems);
itemRouter.get('/search/:contain/:limit', searchItems);

export default itemRouter;
