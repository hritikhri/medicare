import { useState } from "react";
import api from "../../utils/api.js";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }
    if (newPassword.length < 8) {
      return setError("New password must be at least 8 characters long");
    }
    if (currentPassword === newPassword) {
      return setError("New password must be different from current");
    }

    try {
      setLoading(true);
      const res = await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(res.data.message || "Password changed successfully");
      // Clear fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="relative overflow-hidden border border-slate-200 bg-white rounded-[28px]">
    
    {/* Top Accent */}
    <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

    <div className="p-5 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
        
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-medium mb-2">
            Security Settings
          </p>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Change Password
          </h3>

          <p className="text-sm text-slate-500 mt-2 leading-6 max-w-xl">
            Keep your account secure by using a strong password with a mix of letters,
            numbers, and symbols.
          </p>
        </div>

        {/* Status */}
        <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
          <p className="text-[11px] uppercase tracking-wider text-emerald-500">
            Security
          </p>

          <h4 className="text-sm font-semibold text-emerald-700 mt-1">
            Protected
          </h4>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
            className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
              className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Password Tips */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4">
          <p className="text-sm font-medium text-blue-700 mb-2">
            Password Tips
          </p>

          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Use at least 8 characters</li>
            <li>• Include uppercase & lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid common passwords</li>
          </ul>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-700 font-medium">
              {success}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
          
          <button
            type="button"
            className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}