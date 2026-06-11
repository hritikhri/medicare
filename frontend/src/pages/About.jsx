export default function About() {
  return (
    <div className="bg-gray-50 pt-5 min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">About TeleMedHub</h1>
        <p className="max-w-2xl mx-auto text-lg">
          TeleMedHub is a modern telemedicine platform connecting patients with
          trusted doctors anytime, anywhere.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        
        <div className="bg-white shadow-lg p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600">
            Our mission is to make healthcare accessible and convenient for
            everyone through technology. We help patients consult doctors,
            manage health records, and receive medical advice remotely.
          </p>
        </div>

        <div className="bg-white shadow-lg p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600">
            We aim to build the most trusted digital healthcare ecosystem where
            patients and doctors can connect seamlessly across the world.
          </p>
        </div>

      </section>

      {/* Services */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-6 shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3">Online Consultation</h3>
              <p className="text-gray-600">
                Connect with experienced doctors through video or chat anytime.
              </p>
            </div>

            <div className="p-6 shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3">Medical Records</h3>
              <p className="text-gray-600">
                Securely store and manage all your health records in one place.
              </p>
            </div>

            <div className="p-6 shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-3">Prescription System</h3>
              <p className="text-gray-600">
                Get digital prescriptions directly from doctors after
                consultation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Health Journey Today
        </h2>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
          Book Appointment
        </button>
      </section>

    </div>
  );
}