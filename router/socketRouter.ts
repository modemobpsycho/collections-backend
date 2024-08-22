import { Server } from 'socket.io';
import { handleSocketConnection } from '../controllers/socketController';

export const initSocketRoutes = (io: Server) => {
    handleSocketConnection(io);
};
