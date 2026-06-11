import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut, User, Stethoscope } from "lucide-react";
import NotificationBell from "../common/NotificationBell.jsx";

export default function ProtectedLayout() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  const naviate = useNavigate();
  const isDoctor = user.role === "doctor";

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Modern Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-2 flex items-center justify-between">
          {/* Logo Header - Fixed */}
          <div
            onClick={() => {
              navigate(isDoctor ? "/dashboard/doctor" : "/dashboard/patient");
            }}
            className="border-slate-100 flex items-center gap-4 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-slate-900">
                Medico
              </h1>
              <p className="text-xs text-slate-500 -mt-1">Doctor Portal</p>
            </div>
          </div>

          {/* Right Side - User Info + Notification + Logout */}
          <div className="flex items-center gap-6">
            {/* Welcome Message */}
            <div
              onClick={() => {
                navigate(isDoctor ? "/dashboard/doctor" : "/dashboard/patient");
              }}
              className="hidden md:flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-all duration-200 cursor-pointer px-4 py-2 rounded-2xl border border-slate-100"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>

              <div className="text-sm leading-tight">
                <p className="text-slate-500 text-xs">Welcome back,</p>

                <p className="font-semibold text-slate-900">
                  {isDoctor ? "" : ""}
                  {user?.name}
                </p>
              </div>
            </div>

            {/* Notification Bell */}
            {/* <NotificationBell /> */}

            {/* Logout Button */}
            <button
              onClick={() => {
                // Dispatch logout action (adjust according to your Redux setup)
                // dispatch(logout());
                console.log("Logging out...");
                window.location.href = "/auth/login"; // Temporary fallback
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 rounded-2xl transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8 pt-2">
        <div className="max-w-7x max-h-[90vh] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Optional Footer */}
      {/* <footer className="bg-white/80 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © 2026 Medico • Secure Healthcare Platform
      </footer> */}
    </div>
  );
}
