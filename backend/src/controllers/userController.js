const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const Notification = require('../models/Notification');
// const Appointment = require('../models/appointment');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    console.log(req)
    console.log(updates)
    console.log("RAW BODY:", req.body);
    console.log("LOCATION TYPE:", typeof req.body.location);
    console.log("LOCATION VALUE:", req.body.location);

    if (typeof updates.location === 'string') {
      updates.location = JSON.parse(updates.location);  // If sent as string
    }   
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.updateProfilePic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    console.log(req.body)
    if (updates.location) {
      updates.location = JSON.parse(updates.location);  // If sent as string
    }
    if (req.profilePicUrl) {
      updates.profilePic = req.profilePicUrl;
    }    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;  // From JWT middleware

    const user = await User.findById(userId)
      .select('-password')  // Exclude password
      .populate('medicalReports');  // Optional: Populate if needed
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.addMedicalReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(req.file.buffer);
    });

    const user = await User.findById(userId);
    user.medicalReports.push({ name, url: result.secure_url });
    await user.save();

    // Notify if shared, but for now, just save
    res.json({ message: 'Report uploaded' });
  } catch (err) {
    next(err);
  }
};

exports.addPersonalNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { note } = req.body;
    const user = await User.findById(userId);
    user.personalNotes.push({ note });
    await user.save();
    res.json({ message: 'Note added' });
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;  // Fixed: From JWT middleware (req.user = { id: ... })
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from current' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user)

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password (pre-save hook auto-hashes)
    await User.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      { runValidators: false } // 👈 KEY FIX
    );

    await user.save();

    // Optional: Send confirmation email
    await transporter.sendMail({
      to: user.email,
      subject: 'TeleMedHub Password Changed',
      html: '<p>Your password has been updated successfully. If this wasn\'t you, contact support.</p>'
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    next(err);
  }
};

// ─── CHANGE PASSWORD ────────────────────────────────────────────────────────
// exports.changePassword = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ error: 'Current and new password required' });
//     if (newPassword.length < 8)
//       return res.status(400).json({ error: 'New password must be at least 8 characters' });
//     if (currentPassword === newPassword)
//       return res.status(400).json({ error: 'New password must be different from current' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch)
//       return res.status(401).json({ error: 'Current password is incorrect' });

//     user.password = newPassword; // pre-save hook hashes it
//     await user.save();

//     await transporter.sendMail({
//       to: user.email,
//       subject: 'TeleMedHub — Password Changed',
//       html: '<p>Your password was updated successfully. If this wasn\'t you, contact support immediately.</p>',
//     });

//     res.json({ message: 'Password changed successfully' });
//   } catch (err) {
//     next(err);
//   }
// };

// ─── LOGOUT ALL DEVICES ─────────────────────────────────────────────────────
// Strategy: store a `tokenVersion` on the user. Increment it to invalidate
// all existing JWTs (your JWT middleware must verify this field).
exports.logoutAll = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({ message: 'Logged out from all devices successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE ACCOUNT ─────────────────────────────────────────────────────────
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Validate password
    if (!password) {
      return res.status(400).json({
        error: "Password confirmation required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Incorrect password",
      });
    }

    // Delete related records
    await Promise.all([
      Appointment.deleteMany({
        $or: [
          { doctorId: userId },
          { patientId: userId },
        ],
      }),

      PatientRecord.deleteMany({
        $or: [
          { doctorId: userId },
          { patientId: userId },
        ],
      }),
    ]);

    // Delete user
    await User.findByIdAndDelete(userId);

    // Send email safely
    try {
      await transporter.sendMail({
        to: user.email,
        subject: "TeleMedHub — Account Deleted",
        html: `
          <div style="font-family:sans-serif;">
            <h2>Your account has been deleted</h2>
            <p>We're sorry to see you go.</p>
            <p>Your TeleMedHub account was permanently removed.</p>
          </div>
        `,
      });

      console.log("Account deleted email sent:", user.email);
    } catch (mailError) {
      console.error("Email send failed:", mailError.message);
    }

    // Clear auth cookie if using cookies
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (err) {
    console.log(err)
    next(err);
  }
};