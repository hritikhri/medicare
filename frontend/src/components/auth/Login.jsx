import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../redux/slices/authSlice.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const user =await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 mt-10">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-center px-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Welcome back to <span className="text-indigo-600">TeleMedHub</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Securely access your healthcare dashboard, consult doctors, and manage
          appointments in one place.
        </p>

        <div className="mt-10 space-y-3 text-gray-600">
          <p>✔ End-to-end encrypted</p>
          <p>✔ Trusted medical professionals</p>
          <p>✔ Fast & secure consultations</p>
        </div>
      </div>

      {/* RIGHT SIDE – FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-1">
            Sign in
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Continue to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD WITH TOGGLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 text-sm py-2 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {/* ERROR */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON WITH SPINNER */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold 
                bg-gradient-to-r from-indigo-600 to-violet-600
                hover:opacity-90 transition shadow-lg
                flex items-center justify-center
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* DIVIDER */}
            {/* <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div> */}

            {/* GOOGLE LOGIN */}
            {/* <button
              type="button"
              className="w-full py-3 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              🔐 Sign in with Google
            </button> */}
          </form>

          {/* REGISTER */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
