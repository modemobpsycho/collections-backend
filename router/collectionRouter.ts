import multer from 'multer';
import express from 'express';
import {
    getCollections,
    createCollection,
    saveCollectionPhoto
} from '../controllers/collectionController';

const upload = multer();

const collectionRouter = express.Router();

collectionRouter.get('/', getCollections);
collectionRouter.post('/create', createCollection);
collectionRouter.post('/saveCollectionPhoto', upload.single('file'), saveCollectionPhoto);

export default collectionRouter;
