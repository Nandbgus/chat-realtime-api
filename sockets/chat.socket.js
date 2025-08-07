export default function chatSocket(io, socket) {
  socket.on('joinRoom', ({ chatId }) => {
    if (!chatId) {
      console.error("❌ chatId is undefined");
      return;
    }

    socket.join(chatId);
    console.log(`✅ Socket ${socket.id} joined room ${chatId}`);
  });

  // Tidak perlu handle sendMessage di socket, karena message diproses dari REST API
}
