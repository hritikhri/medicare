const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_chat', async ({ appointmentId, userId }) => {
      // Verify access
      const appointment = await Chat.findById(appointmentId); // Simplified
      if (appointment) {
        socket.join(`chat_${appointmentId}`);
        socket.userId = userId;
      }
    });

    socket.on('send_message', async ({ appointmentId, content, senderId }) => {
      // Save and emit (logic in controller, but emit here for real-time)
      const message = { senderId, content, timestamp: new Date() };
      io.to(`chat_${appointmentId}`).emit('new_message', { message });
    });

    socket.on('typing', ({ appointmentId, isTyping }) => {
      socket.to(`chat_${appointmentId}`).emit('user_typing', { userId: socket.userId, isTyping });
    });

    socket.on('disconnect', () => {
      // Broadcast offline
    });
  });
};