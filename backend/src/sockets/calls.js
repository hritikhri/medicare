module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_call', ({ appointmentId, offer }) => {
      // Verify confirmed appointment
      socket.join(`call_${appointmentId}`);
      socket.to(`call_${appointmentId}`).emit('call_offer', { offer });
    });

    socket.on('call_answer', ({ appointmentId, answer }) => {
      socket.to(`call_${appointmentId}`).emit('call_answer', { answer });
    });

    socket.on('ice-candidate', ({ appointmentId, candidate }) => {
      socket.to(`call_${appointmentId}`).emit('ice-candidate', { candidate });
    });

    socket.on('end_call', ({ appointmentId }) => {
      socket.to(`call_${appointmentId}`).emit('call_ended');
      socket.leave(`call_${appointmentId}`);
    });
  });
};