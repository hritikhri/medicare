import { Link } from "react-router-dom";

export default function HeaderPublic() {
  return (
    <header className="fixed w-screen top-0 z-50 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:opacity-90 transition"
        >
          <img style={{height:"45px"}} src="../../../public/hero2.png" alt="" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link
            to="/doctors"
            className="relative font-medium after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Doctors
          </Link>
          <Link
            to="/about"
            className="relative font-medium after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="relative font-medium after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
          >
            Contact
          </Link>

          {/* Login Button */}
          <Link
            to="/auth/login"
            className="px-5 py-2 rounded-lg font-semibold bg-white text-blue-600 border border-white hover:bg-transparent hover:text-white hover:border-white transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-5 py-2 rounded-lg font-semibold bg-emerald-500 text-white border border-emerald-500 hover:bg-transparent hover:text-white hover:border-white transition-all duration-300"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
