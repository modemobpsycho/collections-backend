import { Server, Socket } from 'socket.io';

export const handleSocketConnection = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        let _room: string;
        let _username: string;

        socket.on('joinRoom', (data: { roomId: string }) => {
            const { roomId } = data;
            _room = roomId;
            socket.join(_room);
            io.to(roomId).emit('userJoined');
        });

        socket.on('message', (data: any) => {
            io.to(_room).emit('message', { user: _username, message: data });
        });
    });
};
