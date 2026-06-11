import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 text-gray-700 py-16 relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              TeleMedHub
            </h2>
            <p className="text-sm text-gray-600 max-w-xs mx-auto md:mx-0">
              Connecting you with trusted doctors anytime, anywhere.  
              Secure. Reliable. Healthcare-first.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              <Link className="hover:text-indigo-600 transition" to="/privacy">
                Privacy Policy
              </Link>
              <Link className="hover:text-indigo-600 transition" to="/terms">
                Terms & Conditions
              </Link>
              <Link className="hover:text-indigo-600 transition" to="/about">
                About Us
              </Link>
              <Link className="hover:text-indigo-600 transition" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start gap-6">
              <a className="hover:text-indigo-600 transition font-medium" href="#">
                Twitter
              </a>
              <a className="hover:text-indigo-600 transition font-medium" href="#">
                Facebook
              </a>
              <a className="hover:text-indigo-600 transition font-medium" href="#">
                LinkedIn
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mt-4 mb-4">
              Get the TeleMedHub App
            </h3>
            <div className="flex justify-center md:justify-start gap-6">
              <div className="flex justify-center flex-wrap gap-6">
            <a
              href="#"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-md 
                   transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-blue-500"
            >
              Google Play
            </a>
            <a
              href="#"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg 
                   transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-pink-600 hover:to-purple-500"
            >
              App Store
            </a>
          </div>
            </div>
          </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-300/60 pt-6 text-center text-sm text-gray-600">
          © 2026 TeleMedHub. All rights reserved.
        </div>
      </div>

      {/* Soft Accent Blobs */}
      <div className="absolute -top-10 left-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
    </footer>
  );
}
