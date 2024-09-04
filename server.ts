import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { initSocketRoutes } from './router/socketRouter';
import userRouter from './router/userRouter';
import collectionRouter from './router/collectionRouter';
import itemRouter from './router/itemRouter';
import commentRouter from './router/commentRouter';
import reactionRouter from './router/reactionRouter';
import tagRouter from './router/tagRouter';
import jiraRouter from './router/jiraRouter';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/photos'));

const corsOptions = {
    origin: ['https://collections-taratuta.netlify.app', 'http://localhost:5173']
};

app.use(cors(corsOptions));

app.use('/api/user', userRouter);
app.use('/api/collection', collectionRouter);
app.use('/api/item', itemRouter);
app.use('/api/comment', commentRouter);
app.use('/api/reaction', reactionRouter);
app.use('/api/tag', tagRouter);
app.use('/api/jira', jiraRouter);
initSocketRoutes(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});

export default app;
