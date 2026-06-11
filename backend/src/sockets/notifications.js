const Notification = require('../models/Notification');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_notifications', (userId) => {
      socket.join(`user_${userId}`);
    });

    const emitNotification = async (userId, notif) => {
      await Notification.create(notif);
      io.to(`doctor_${userId}`).emit('notification', notif);
    };

    // Expose to controllers via req.io = io
    global.emitNotification = emitNotification;
  });
};
