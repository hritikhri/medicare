const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');

exports.getChat = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId).populate('patientId doctorId');
    if (!appointment || appointment.status !== 'confirmed') return res.status(403).json({ error: 'Access denied' });

    const participants = [appointment.patientId._id, appointment.doctorId.userId];
    let chat = await Chat.findOne({ participants: { $all: participants, $size: 2 } }).populate('messages.senderId', 'name');
    if (!chat) {
      chat = new Chat({ participants });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { appointmentId, content } = req.body;
    const senderId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.status !== 'confirmed') return res.status(403).json({ error: 'Access denied' });

    const participants = [appointment.patientId, appointment.doctorId.userId];
    const chat = await Chat.findOneAndUpdate(
      { participants: { $all: participants, $size: 2 } },
      { $push: { messages: { senderId, content } } },
      { upsert: true, new: true }
    ).populate('messages.senderId', 'name');

    const message = chat.messages[chat.messages.length - 1];
    req.io.to(`chat_${appointmentId}`).emit('new_message', { message });

    // Notify
    const recipientId = participants.find(p => p.toString() !== senderId.toString());
    const notif = new Notification({
      userId: recipientId,
      type: 'message',
      message: `New message from ${req.user.name}`,
      relatedId: appointmentId
    });
    await notif.save();

    res.json(message);
  } catch (err) {
    next(err);
  }
};