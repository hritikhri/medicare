import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api.js";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "patient",
  });

  const [step, setStep] = useState(1); // 1 = Register, 2 = OTP
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* REGISTER */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard/patient");
    } catch (err) {
      setError(err?.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 mt-8">

      {/* LEFT INFO PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Join <span className="text-indigo-600">TeleMedHub</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Create your account to consult doctors, manage appointments,
          and experience secure digital healthcare.
        </p>

        <div className="mt-10 space-y-3 text-gray-600">
          <p>✔ Verified doctors</p>
          <p>✔ Secure OTP based access</p>
          <p>✔ Patient & Doctor dashboards</p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">

          {/* STEP 1: REGISTER */}
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-center text-gray-500 mb-8">
                It only takes a few seconds
              </p>

              <form onSubmit={handleRegister} className="space-y-4">

                {/* NAME */}
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* EMAIL */}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 pr-12 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                {/* MOBILE */}
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* ROLE */}
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
                
                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-xl text-white font-semibold
                    bg-gradient-to-r from-indigo-600 to-violet-600
                    flex items-center justify-center transition
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 text-sm border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-center text-gray-500 mb-8">
                Enter the OTP sent to <strong>{formData.email}</strong>
              </p>

              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-5">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-center tracking-widest"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold
                    bg-gradient-to-r from-indigo-600 to-violet-600
                    flex items-center justify-center transition
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
