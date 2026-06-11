export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-12">
          Contact TeleMedHub
        </h1>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white shadow-lg p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-600">
                TeleMedHub Health Center, Delhi, India
              </p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">support@telemedhub.com</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
              <p className="text-gray-600">24/7 Online Support</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-xl p-8 rounded-xl">

            <h2 className="text-2xl font-semibold mb-6">
              Send us a message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}