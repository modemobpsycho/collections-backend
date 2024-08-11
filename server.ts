import express from 'express';
import cors from 'cors';
import userRouter from './router/userRouter';
import collectionRouter from './router/collectionRouter';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['https://itra-final-task-frontend.vercel.app', 'http://localhost:5173']
};

app.use(cors(corsOptions));

app.use('/api/user', userRouter);
app.use('/api/collection', collectionRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});

export default app;