// sockets/socket.js
import chatSocket from './chat.socket.js';

export function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    chatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
