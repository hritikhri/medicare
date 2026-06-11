const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('../middleware/rateLimit');
const { registerSchema } = require('../middleware/validation');
const { validate } = require('joi'); // Assume helper for validation
const auth = require('../middleware/auth');

router.post('/register', rateLimit, (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}, authController.register);

router.post('/verify-otp', authController.verifyOTP);
router.post('/login',rateLimit, authController.login); 
router.post('/google-login', authController.googleLogin);

// New forgot password routes (public, rate-limited) 
router.post('/forgot-password', rateLimit, authController.forgotPassword);
router.post('/verify-otp-forgot', rateLimit, authController.verifyOtpForgot);
router.post('/reset-password', rateLimit, authController.resetPassword);

// router.post('/change-password', rateLimit, authController.changePassword);

// router.use(auth);

// router.post('/change-password', rateLimit, userController.changePassword);
// router.post('/logout-all', userController.logoutAll);
// router.delete('/delete-account', userController.deleteAccount);

module.exports = router;