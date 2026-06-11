import React, { useState } from "react";
import {
  Shield,
  LogOut,
  Trash2,
  AlertTriangle,
  Lock,
  Smartphone,
  CheckCircle2,
  Monitor,
} from "lucide-react";

const Security = ({
  handleLogout,
  handleDeleteAccount,
  isLoggingOut,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const SecurityItem = ({ icon: Icon, title, desc, status, color }) => (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-none">
      
      <div className="flex items-start gap-4">
        
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
          ${
            color === "green"
              ? "bg-emerald-100 text-emerald-600"
              : color === "blue"
              ? "bg-blue-100 text-blue-600"
              : color === "violet"
              ? "bg-violet-100 text-violet-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {title}
          </h4>

          <p className="text-xs text-slate-500 mt-1 leading-5">
            {desc}
          </p>
        </div>
      </div>

      {status && (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap
          ${
            color === "green"
              ? "bg-emerald-100 text-emerald-700"
              : color === "blue"
              ? "bg-blue-100 text-blue-700"
              : color === "violet"
              ? "bg-violet-100 text-violet-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 mb-8">
          
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-3">
                Security Center
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Account Security
              </h1>

              <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl leading-7">
                Manage account protection, active sessions, device access,
                and security preferences.
              </p>
            </div>

            {/* Status */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 min-w-[220px]">
              
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Account Status
              </p>

              <div className="flex items-center gap-3 mt-3">
                
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Protected
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    All systems secured
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">

            {/* SECURITY STATUS */}
            <div className="bg-white rounded-[28px] border border-slate-200 overflow-hidden">
              
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  Security Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Current protection status of your account
                </p>
              </div>

              <div className="px-6 py-2">
                
                <SecurityItem
                  icon={CheckCircle2}
                  title="Account Protection"
                  desc="Your account security protection is active and working properly."
                  status="Protected"
                  color="green"
                />

                <SecurityItem
                  icon={Lock}
                  title="Password Security"
                  desc="Your password is encrypted and securely stored."
                  status="Enabled"
                  color="blue"
                />

                <SecurityItem
                  icon={Smartphone}
                  title="Device Security"
                  desc="Current device session is verified and active."
                  status="Verified"
                  color="violet"
                />

                <SecurityItem
                  icon={Monitor}
                  title="Session Monitoring"
                  desc="Unusual login activity is continuously monitored."
                  status="Active"
                  color="green"
                />
              </div>
            </div>

            {/* LOGOUT */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                
                <div className="flex items-start gap-4">
                  
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Logout Session
                    </h3>

                    <p className="text-sm text-slate-500 mt-1 leading-6 max-w-xl">
                      Securely logout from your current session on this device.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="h-11 px-6 rounded-2xl bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white text-sm font-medium transition"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="relative overflow-hidden rounded-[28px] border border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-200/20 rounded-full blur-3xl" />

              <div className="relative p-6">
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  <div className="flex items-start gap-4">
                    
                    <div className="w-14 h-14 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2">
                        Danger Zone
                      </p>

                      <h3 className="text-2xl font-bold text-red-700">
                        Delete Account
                      </h3>

                      <p className="text-sm text-slate-600 mt-3 leading-7 max-w-2xl">
                        Permanently remove your account, profile, appointments,
                        and associated data. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition shadow-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            
            {/* SECURITY TIPS */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
              
              <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl" />

              <div className="relative">
                
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-4">
                  Security Tips
                </p>

                <h3 className="text-xl font-semibold leading-snug">
                  Keep your account safe and protected.
                </h3>

                <ul className="mt-5 space-y-3 text-sm text-slate-300 leading-7">
                  <li>• Use strong passwords</li>
                  <li>• Never share credentials</li>
                  <li>• Logout from unused devices</li>
                  <li>• Regularly update passwords</li>
                  <li>• Monitor suspicious activity</li>
                </ul>
              </div>
            </div>

            {/* QUICK STATUS */}
            <div className="bg-white rounded-[28px] border border-slate-200 p-6">
              
              <h3 className="text-lg font-semibold text-slate-900 mb-5">
                Quick Status
              </h3>

              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Account Protection
                  </span>

                  <span className="text-sm font-semibold text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Device Session
                  </span>

                  <span className="text-sm font-semibold text-blue-600">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Security Health
                  </span>

                  <span className="text-sm font-semibold text-violet-600">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            
            <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl">
              
              <div className="p-7">
                
                <div className="flex items-start gap-5 mb-6">
                  
                  <div className="w-14 h-14 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Delete Account?
                    </h3>

                    <p className="text-sm text-slate-600 mt-3 leading-7">
                      This will permanently delete your account and all related
                      information. This action cannot be reversed.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 h-11 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;