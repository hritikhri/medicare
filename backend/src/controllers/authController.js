const User = require("../models/User");
const Doctor = require("../models/Doctor"); // Add import
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const nodemailer = require("nodemailer");
const redis = require("../config/redis");
const bcrypt = require("bcryptjs");

var OTPstorage = null;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // await redis.setex(`otp:${email}`, 300, otp);
    OTPstorage = otp;
    console.log(otp);

    await transporter.sendMail({
      to: email,
      subject: "Verify Your TeleMedHub Account",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 520px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <h2 style="color: #1f2937; margin-bottom: 12px;">
        Account Verification
      </h2>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Hello,
      </p>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Thank you for signing up with <strong>TeleMedHub</strong>.
        Please use the verification code below to complete your registration.
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <span style="
          display: inline-block;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #2563eb;
          background-color: #eff6ff;
          padding: 12px 20px;
          border-radius: 8px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        This OTP is valid for <strong>5 minutes</strong>.
        Please do not share this code with anyone.
      </p>

      <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
        If you did not request this verification, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} TeleMedHub. All rights reserved.
      </p>
    </div>
  </div>
`,
});

    const user = new User({ name, email, password, mobile, role });
    await user.save();

    if (role === "doctor") {
      const doctor = new Doctor({
        userId: user._id,
        bio: `New doctor profile for ${name}. Please update your details.`,
        specializations: ["General Physician"], // Default
        experience: 0,
        consultationFee: 100, // Default
        availabilitySlots: [], // Empty—doctor adds later
        ratings: { average: 0, count: 0 },
        reviews: [],
      });
      await doctor.save();
      console.log(`Doctor profile created for ${user._id}`);
    }

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const storedOTP = OTPstorage;
    //  await redis.get(`otp:${email}`);
    if (!storedOTP || otp !== storedOTP)
      return res.status(400).json({ error: "Invalid OTP" });

    // await redis.del(`otp:${email}`);
    OTPstorage = null;

    const user = await User.findOne({ email });
    user.isVerified = true;
    await user.save();

    if (user.role === 'doctor') {
    const existingDoctor = await Doctor.findOne({ userId: user._id });
    if (!existingDoctor) {
      // Create as above...
      const doctor = new Doctor({
        userId: user._id,
        bio: `New doctor profile for ${name}. Please update your details.`,
        specializations: ["General Physician"], // Default
        experience: 0,
        consultationFee: 100, // Default
        availabilitySlots: [], // Empty—doctor adds later
        ratings: { average: 0, count: 0 },
        reviews: [],
      });
      await doctor.save();
    }
  }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)) || !user.isVerified) {
      return res
        .status(401)
        .json({ error: "Invalid credentials or unverified account" });
    }

    let userData = { id: user._id, name: user.name, email: user.email, role: user.role };
    
    let doctor = null;
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      userData.doctorId = doctor?._id;  // For dashboard
      console.log("doctor ID",userData.doctorId);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: userData.doctorId,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        isVerified: true,
        role: "patient",
      });
      await user.save();
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Existing methods (add these below them)
var ForgotOTP = null;

// Step 1: Initiate forgot password (send OTP to email)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in Redis (expires 5 mins)
    // await redis.setEx(`forgot_otp:${email}`, 300, otp);
    ForgotOTP = otp;
    console.log(ForgotOTP);

    await transporter.sendMail({
      to: email,
      subject: "TeleMedHub Password Reset",
      html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Step 2: Verify OTP for forgot password
exports.verifyOtpForgot = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const storedOTP = ForgotOTP;
    console.log(otp, ForgotOTP);

    // await redis.get(`forgot_otp:${email}`);
    if (!storedOTP || otp !== storedOTP) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP valid—generate/reset token (short-lived for reset)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    // await redis.del(`forgot_otp:${email}`);  // Clean up OTP
    ForgotOTP = null;
    res.json({
      resetToken,
      message: "OTP verified. Use token to reset password",
    });
  } catch (err) {
    next(err);
  }
};

// Step 3: Reset password using verified token
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    // 1️⃣ Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const { email } = decoded;

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3️⃣ Hash password (IMPORTANT)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update ONLY password (🔥 NO validation issue)
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { runValidators: false } // 👈 KEY FIX
    );

    return res.json({
      message: "Password reset successfully. Please login with new password",
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    console.error(err);
    next(err);
  }
};
// Existing methods...

// Change password (requires auth)
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id; // Fixed: From JWT middleware (req.user = { id: ... })
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new password required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password must be different from current" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password (pre-save hook auto-hashes)
    user.password = newPassword;
    await user.save();

    // Optional: Send confirmation email
    await transporter.sendMail({
      to: user.email,
      subject: "TeleMedHub Password Changed",
      html: "<p>Your password has been updated successfully. If this wasn't you, contact support.</p>",
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    next(err);
  }
};
