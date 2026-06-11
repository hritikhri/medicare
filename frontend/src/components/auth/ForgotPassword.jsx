import React, { useState } from 'react';
import api from '../../utils/api';
import { Fade } from 'react-awesome-reveal'; // optional animation library
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate()

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email');
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      alert('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Please enter the OTP');
    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp-forgot', { email, otp });
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert('Enter a new password');
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { resetToken, newPassword });
      alert('Password reset successful! Login again.');
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setResetToken('');
      Navigate("/auth/login")
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 items-center justify-center p-6">
      {/* Left Side: Contextual Info */}
      <div className="w-1/3 hidden md:flex flex-col justify-center pr-10">
        {step === 1 && (
          <Fade direction="left" duration={800}>
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">Forgot Your Password?</h1>
            <p className="text-indigo-600 text-lg">
              Enter your registered email. We’ll send a one-time OTP to help you reset your password securely.
            </p>
          </Fade>
        )}
        {step === 2 && (
          <Fade direction="left" duration={800}>
            <h1 className="text-3xl font-bold text-green-700 mb-4">Verify OTP</h1>
            <p className="text-green-600 text-lg">
              Check your inbox for the OTP. Enter it here to proceed and reset your password safely.
            </p>
          </Fade>
        )}
        {step === 3 && (
          <Fade direction="left" duration={800}>
            <h1 className="text-3xl font-bold text-purple-700 mb-4">Set a New Password</h1>
            <p className="text-purple-600 text-lg">
              Create a strong, secure password. Make sure it’s unique and hard to guess.
            </p>
          </Fade>
        )}
      </div>

      {/* Right Side: Forms */}
      <div className="w-full md:w-2/3 max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transition-all duration-500 ease-in-out">
        {step === 1 && (
          <form onSubmit={handleForgot} className="space-y-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Step 1: Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Step 2: OTP Verification</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">Step 3: Reset Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
