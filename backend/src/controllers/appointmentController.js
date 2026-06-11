const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Add this function
exports.updatePatientNotes = async (req, res, next) => {
  try {
    const { id } = req.params;           // Patient ID
    const { notes } = req.body;          // New note text

    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes field is required' });
    }

    // Find patient (User model with role: 'patient')
    const patient = await User.findById(id);   // Assuming you have User model

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Append new note with timestamp (recommended structure)
    const newNoteEntry = {
      text: notes.trim(),
      addedBy: req.user.id,           // Doctor who added it
      addedAt: new Date(),
      // Optional: appointmentId: req.body.appointmentId  (if linked to specific visit)
    };

    // Push to personalNotes array (or create if not exists)
    if (!patient.personalNotes) patient.personalNotes = [];
    patient.personalNotes.unshift(newNoteEntry);   // newest first

    await patient.save();

    res.json({
      success: true,
      message: 'Notes added successfully',
      patient: {
        _id: patient._id,
        name: patient.name,
        personalNotes: patient.personalNotes
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, time, notes } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !appointmentDate || !time) {
      return res.status(400).json({ 
        message: "Doctor ID, appointment date and time are required" 
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Optional: Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      time: time,                    // Added time check
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      time,           // ← Added
      notes: notes || "",   // ← Added (optional)
      status: 'pending'
    });

    await appointment.save();

    // Create notification for doctor
    const notif = new Notification({
      userId: doctor.userId,
      type: 'appointment',
      message: `New appointment booked by ${req.user.name}`,
      relatedId: appointment._id
    });
    await notif.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor_${doctorId}`).emit('new_appointment', appointment);
    }

    console.log("Appointment booked successfully");
    
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    if (!['doctor', 'patient'].includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(userId);

    let query;

    if (role === 'doctor') {
      // ✅ Find the Doctor document whose userId matches the logged-in user
      const doctorProfile = await Doctor.findOne({ userId: objectId });

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      console.log("Doctor profile found:", doctorProfile._id); // ← confirm this ID

      query = { doctorId: doctorProfile._id }; // ✅ Use Doctor._id, not User._id
    } else {
      query = { patientId: objectId }; // Patient uses User._id directly (correct)
    }

    const { status } = req.query;
    if (status) query.status = status;

    const now = new Date();
    await Appointment.updateMany(
      {
        ...query,
        status: { $in: ['pending', 'confirmed'] },
        appointmentDate: { $lt: now }
      },
      { $set: { status: 'cancelled' } }
    );

    let populateOptions;

    if (role === 'doctor') {
      populateOptions = {
        path: 'patientId',
        select: 'name email profilePic bloodGroup address location'
      };
    } else {
      populateOptions = {
        path: 'doctorId',
        select: 'userId profilePic specializations department consultationFee ratings isVerified',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      };
    }

    const appointments = await Appointment.find(query)
      .populate(populateOptions)
      .sort({ appointmentDate: -1 });

    console.log(`Found appointments for ${role}:`, appointments.length);
    console.log("Query used:", query);

    res.json({
      success: true,
      appointments
    });

  } catch (err) {
    console.error("Get Appointments Error:", err);
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

    // Notify patient if confirmed
    if (status === 'confirmed') {
      const notif = new Notification({
        userId: appointment.patientId,
        type: 'appointment',
        message: 'Your appointment has been confirmed',
        relatedId: id
      });
      await notif.save();
      req.io.to(`patient_${appointment.patientId}`).emit('appointment_confirmed', appointment);
    }

    res.json(appointment);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.cancelPatientAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const { role } = req.user;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Authorization check
    if (role === 'patient' && appointment.patientId.toString() !== userId) {
      return res.status(403).json({ message: "You can only cancel your own appointments" });
    }
    if (role === 'doctor' && appointment.doctorId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent cancelling already completed or cancelled appointments
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: `Appointment is already ${appointment.status}` });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Optional: Notify doctor
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor_${appointment.doctorId}`).emit('appointment_cancelled', {
        appointmentId: appointment._id,
        patientId: appointment.patientId
      });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    console.log(appointmentId)
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    

    // Free slot
    const doctor = await Doctor.findById(appointment.doctorId);
    const slot = doctor.availabilitySlots.find(s => s.date.toDateString() === appointment.appointmentDate.toDateString() && s.time === appointment.time);
    if (slot) slot.isBooked = false;
    await doctor.save();

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment Canceled successfully",
      appointment
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};


exports.completeAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const { role } = req.user;
 
    // ── find appointment ──
    const appointment = await Appointment.findById(appointmentId);
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    // ── authorization: only doctor can complete their own appointments ──
    if (role !== 'doctor') {
      return res.status(403).json({ message: "Only doctors can complete appointments" });
    }
 
    // Verify it's the doctor's appointment
    const doctorProfile = await Doctor.findOne({ userId });
    if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: "You can only complete your own appointments" });
    }
 
    // ── prevent completing already completed/cancelled appointments ──
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        message: `Appointment is already ${appointment.status}. Cannot change status.`
      });
    }
 
    // ── update status ──
    appointment.status = 'completed';
    await appointment.save();
 
    // ── populate & return ──
    const populated = await appointment.populate([
      { path: 'patientId', select: 'name email' },
      {
        path: 'doctorId',
        select: 'userId specializations',
        populate: { path: 'userId', select: 'name' }
      }
    ]);
 
    // ── emit event ──
    const io = req.app.get('io');
    if (io) {
      io.to(`patient_${appointment.patientId}`).emit('appointment_completed', {
        appointmentId: appointment._id,
        doctorName: populate.doctorId.userId.name,
      });
    }
 
    res.json({
      success: true,
      message: "Appointment marked as completed successfully",
      appointment: populated
    });
 
  } catch (err) {
    console.error("Complete Appointment Error:", err);
    next(err);
  }
};




// exports.cancelAppointment = async (req, res, next) => {
//   try {
//     const { appointmentId } = req.params;
//     const userId = req.user.id;
//     const { role } = req.user;
 
//     // ── find appointment ──
//     const appointment = await Appointment.findById(appointmentId);
 
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }
 
//     // ── authorization ──
//     if (role === 'patient') {
//       // Patients can cancel their own appointments
//       if (appointment.patientId.toString() !== userId) {
//         return res.status(403).json({ message: "You can only cancel your own appointments" });
//       }
//     } else if (role === 'doctor') {
//       // Doctors can cancel appointments with their patients
//       const doctorProfile = await Doctor.findOne({ userId });
//       if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
//         return res.status(403).json({ message: "You can only cancel your own appointments" });
//       }
//     } else {
//       return res.status(403).json({ message: "Access denied" });
//     }
 
//     // ── prevent cancelling already completed/cancelled appointments ──
//     if (['completed', 'cancelled'].includes(appointment.status)) {
//       return res.status(400).json({
//         message: `Appointment is already ${appointment.status}. Cannot cancel.`
//       });
//     }
 
//     // ── update status ──
//     appointment.status = 'cancelled';
//     await appointment.save();
 
//     // ── populate & return ──
//     const populated = await appointment.populate([
//       { path: 'patientId', select: 'name email' },
//       {
//         path: 'doctorId',
//         select: 'userId specializations',
//         populate: { path: 'userId', select: 'name' }
//       }
//     ]);
 
//     // ── emit event to both parties ──
//     const io = req.app.get('io');
//     if (io) {
//       // Notify doctor
//       io.to(`doctor_${appointment.doctorId}`).emit('appointment_cancelled', {
//         appointmentId: appointment._id,
//         patientId: appointment.patientId,
//         cancelledBy: role
//       });
 
//       // Notify patient
//       io.to(`patient_${appointment.patientId}`).emit('appointment_cancelled', {
//         appointmentId: appointment._id,
//         cancelledBy: role
//       });
//     }
 
//     res.json({
//       success: true,
//       message: "Appointment cancelled successfully",
//       appointment: populated
//     });
 
//   } catch (err) {
//     console.error("Cancel Appointment Error:", err);
//     next(err);
//   }
// };
 
// ─────────────────────────────────────────────────────────────────────────────
// ADD/UPDATE NOTES
// ─────────────────────────────────────────────────────────────────────────────
 
exports.updateAppointmentNotes = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;
    const { role } = req.user;
 
    // ── validation ──
    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({ message: "Valid notes text is required" });
    }
 
    // ── find appointment ──
    const appointment = await Appointment.findById(appointmentId);
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    // ── authorization: only doctor can add notes ──
    if (role !== 'doctor') {
      return res.status(403).json({ message: "Only doctors can add clinical notes" });
    }
 
    const doctorProfile = await Doctor.findOne({ userId });
    if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: "You can only add notes to your own appointments" });
    }
 
    // ── update notes ──
    appointment.notes = notes.trim();
    await appointment.save();
 
    // ── also update patient's personalNotes ──
    const patient = await User.findById(appointment.patientId);
    if (patient) {
      patient.personalNotes = patient.personalNotes || [];
      patient.personalNotes.push({
        note: notes.trim(),
        date: new Date()
      });
      await patient.save();
    }
 
    // ── populate & return ──
    const populated = await appointment.populate([
      { path: 'patientId', select: 'name email personalNotes' },
      {
        path: 'doctorId',
        select: 'userId specializations',
        populate: { path: 'userId', select: 'name' }
      }
    ]);
 
    res.json({
      success: true,
      message: "Notes added successfully",
      appointment: populated,
      patient: patient
    });
 
  } catch (err) {
    console.error("Update Notes Error:", err);
    next(err);
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE APPOINTMENT
// ─────────────────────────────────────────────────────────────────────────────
 
// exports.getAppointmentById = async (req, res, next) => {
//   try {
//     const { appointmentId } = req.params;
 
//     const appointment = await Appointment.findById(appointmentId).populate([
//       { path: 'patientId', select: 'name email profilePic' },
//       {
//         path: 'doctorId',
//         select: 'userId profilePic specializations department consultationFee',
//         populate: { path: 'userId', select: 'name email' }
//       }
//     ]);
 
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }
 
//     res.json({
//       success: true,
//       appointment
//     });
 
//   } catch (err) {
//     console.error("Get Appointment Error:", err);
//     next(err);
//   }
// };
 
// ─────────────────────────────────────────────────────────────────────────────
// DELETE APPOINTMENT (admin only)
// ─────────────────────────────────────────────────────────────────────────────
 
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { role } = req.user;
 
    if (role !== 'admin') {
      return res.status(403).json({ message: "Only admins can delete appointments" });
    }
 
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
 
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
 
    res.json({
      success: true,
      message: "Appointment deleted successfully"
    });
 
  } catch (err) {
    console.error("Delete Appointment Error:", err);
    next(err);
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// BULK UPDATE STATUS (admin utility)
// ─────────────────────────────────────────────────────────────────────────────
 
exports.bulkUpdateStatus = async (req, res, next) => {
  try {
    const { appointmentIds, status } = req.body;
    const { role } = req.user;
 
    if (role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
 
    if (!Array.isArray(appointmentIds) || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid request" });
    }
 
    const result = await Appointment.updateMany(
      { _id: { $in: appointmentIds } },
      { $set: { status } }
    );
 
    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} appointments`,
      result
    });
 
  } catch (err) {
    console.error("Bulk Update Error:", err);
    next(err);
  }
};