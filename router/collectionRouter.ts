import multer from 'multer';
import express from 'express';
import {
    getAllCollections,
    createCollection,
    saveCollectionPhoto,
    getMyCollections,
    getCollectionInfo,
    deleteCollection,
    changeCollectionInfo,
    getBiggestCollectionsByItems
} from '../controllers/collectionController';
import { checkAuth } from '../helpers/checkAuth';

const upload = multer();

const collectionRouter = express.Router();

collectionRouter.get('/getAll/:limit', getAllCollections);
collectionRouter.get('/me', checkAuth, getMyCollections);
collectionRouter.get('/biggest', getBiggestCollectionsByItems);
collectionRouter.post('/create', checkAuth, createCollection);
collectionRouter.post('/savePhoto', checkAuth, upload.single('file'), saveCollectionPhoto);
collectionRouter.put('/:collectionId', checkAuth, changeCollectionInfo);
collectionRouter.delete('/:collectionId', checkAuth, deleteCollection);
collectionRouter.get('/:collectionId', getCollectionInfo);

export default collectionRouter;
