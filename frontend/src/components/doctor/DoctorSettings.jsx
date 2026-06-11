import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Mail, Shield, AlertTriangle } from 'lucide-react';
import ChangePassword from "../../components/auth/ChangePassword.jsx";
import api from '../../utils/api.js';

export default function DoctorSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch({ type: 'auth/logout' }); // clears Redux state + localStorage token
    navigate('/auth/login');
  };
   // ── Logout ALL devices (invalidates tokenVersion on server) ───────────────
  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await api.post('/users/logout-all');
      dispatch({ type: 'auth/logout' });
      navigate('/auth/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to logout from all devices');
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    setDeleteLoading(true);
    try {
      await api.delete('/users/delete-account', { data: { password: deletePassword } });
      dispatch({ type: 'auth/logout' });
      navigate('/auth/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };


return (
  <div className="w-full min-h-screen bg-slate-50">

    {/* TOP HEADER */}
    <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
      
      <div className="px-6 lg:px-10 py-5 flex items-center justify-between">
        
        {/* LEFT */}
        <div>
          
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium">
            Account Management
          </p>

          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Settings
          </h1>

        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-700">
              Protected
            </span>
          </div>

        </div>

      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="px-6 lg:px-10 py-8">

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">

        {/* LEFT SECTION */}
        <div className="space-y-10">

          {/* ACCOUNT SECURITY */}
          <section>

            <div className="flex items-center gap-3 mb-5">
              
              <Shield className="w-4 h-4 text-slate-700" />

              <h2 className="text-sm font-semibold text-slate-900 tracking-wide">
                ACCOUNT SECURITY
              </h2>

            </div>

            <div className="border-b border-slate-200 pb-8">
              
              <div className="mb-6">
                
                <h3 className="text-lg font-medium text-slate-900">
                  Change Password
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Update your password to keep your account secure.
                </p>

              </div>

              <ChangePassword />

            </div>
          </section>

          {/* EMAIL */}
          <section className="border-b border-slate-200 pb-8">

            <div className="flex items-start justify-between gap-6">

              {/* LEFT */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>

                <div>

                  <div className="flex items-center gap-3 flex-wrap">
                    
                    <h3 className="text-base font-semibold text-slate-900">
                      Email Verification
                    </h3>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                      VERIFIED
                    </span>

                  </div>

                  <p className="text-sm text-slate-500 mt-2 leading-6 max-w-2xl">
                    Your email address is verified and secured successfully.
                  </p>

                </div>
              </div>

              {/* BUTTON */}
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition whitespace-nowrap">
                Resend
              </button>

            </div>
          </section>

          {/* SESSION */}
          <section className="border-b border-slate-200 pb-8">

            <div className="flex items-start justify-between gap-6">

              {/* LEFT */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>

                <div>

                  <h3 className="text-base font-semibold text-slate-900">
                    Logout Session
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-6 max-w-2xl">
                    Sign out from the current active session.
                  </p>

                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-5 py-2 bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white text-xs font-medium rounded-xl transition whitespace-nowrap"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>
          </section>

          {/* DELETE */}

        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">

          {/* STATUS */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="divide-y divide-slate-100">

              <StatusItem
                label="Email Verification"
                status="Verified"
                color="emerald"
              />

              <StatusItem
                label="Password Protection"
                status="Enabled"
                color="blue"
              />

              <StatusItem
                label="Session Security"
                status="Active"
                color="violet"
              />

            </div>
          </div>

          {/* SECURITY TIPS */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden text-white">
            
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-semibold">
                Security Tips
              </h3>
            </div>

            <div className="p-5">
              
              <ul className="space-y-4 text-sm text-slate-300">

                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  Use a strong password
                </li>

                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  Never share credentials
                </li>

                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  Logout from unused devices
                </li>

                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  Verify your email regularly
                </li>

              </ul>

            </div>
          </div>

        </aside>

      </div>
    </div>

    {/* DELETE MODAL */}
   {showDeleteModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">

      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Delete Account</h3>
            <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-600 leading-7">
          Deleting your account will permanently remove all profile,
          appointments, and patient related data from the system.
        </p>

        {/* Password confirmation */}
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
          placeholder="Enter your password to confirm"
          className="w-full mt-5 h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
        />

        {deleteError && (
          <p className="text-xs text-red-600 mt-2 font-medium">{deleteError}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm rounded-xl transition disabled:cursor-not-allowed"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  </div>

);
}

const StatusItem = ({ label, status, color }) => {
  
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },

    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },

    violet: {
      bg: "bg-violet-100",
      text: "text-violet-700",
      dot: "bg-violet-500",
    },

    red: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  };

  const selected = colorStyles[color] || colorStyles.blue;
};