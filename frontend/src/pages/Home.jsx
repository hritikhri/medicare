import { Link } from "react-router-dom";
import DoctorList from "../components/shared/DoctorList.jsx";

const mockTestimonials = [
  { text: "Excellent service! Highly recommend.", author: "Jane Doe" },
  { text: "Quick and reliable consultations.", author: "John Smith" },
  { text: "Great doctors and easy booking.", author: "Alice Johnson" },
];
const ListingDoctors = [
  {
    name: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    experience: "12+ Years",
    image: "/images/doctor1.avif",
  },
  {
    name: "Dr. Neha Verma",
    specialization: "Dermatologist",
    experience: "8+ Years",
    image: "/images/femaildoctor1.webp",
  },
  {
    name: "Dr. Aman Gupta",
    specialization: "General Physician",
    experience: "10+ Years",
    image: "/images/doctor3.avif",
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100">
      {/* bg-gradient-to-b from-blue-50 to-violet-50 */}
      {/* Hero Section */}
      <section style={{zIndex:"99"}} className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Healthcare, <br />
              <span className="text-emerald-300">Reimagined Digitally</span>
            </h1>

            <p className="text-lg text-white/90 max-w-xl">
              Consult trusted doctors, book appointments, and manage your health
              — all from one secure digital platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {/* Primary */}
              <Link
                to="/doctors"
                className="relative inline-flex items-center justify-center px-8 py-3 font-semibold rounded-xl
                     bg-white text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600
                     hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                Find Doctors
              </Link>

              {/* Secondary */}
              <Link
                to="/auth/register"
                className="px-8 py-3 rounded-xl font-semibold border border-white/70 text-white
                     hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-6 flex items-center gap-4 text-sm text-white/80">
              <span className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-md">
                🔒 Secure & HIPAA-Ready
              </span>
              <span>⭐ Trusted by 10,000+ patients</span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div style={{marginRight:"150px"}} className="relative flex justify-center md:justify-end">
            <div className="relative rounded-xl p-4 shadow-2xl- ">
              <img
                src="/images/hero2.png"
                alt="Online Doctor Consultation"
                className="w-[250px] max-w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* Featured Doctors */}
      <section className="py-20 h-[90vh]">
        <div className="container mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Featured Doctors
              </span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              Consult experienced and verified doctors across multiple
              specialties.
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {ListingDoctors.map((doc, i) => (
              <div
                key={i}
                className="group relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6
                     border border-white/40 hover:border-blue-400
                     hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Doctor Image */}
                <div className="flex justify-center -mt-16">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md
                         group-hover:scale-105 transition duration-300"
                  />
                </div>
                {/* Online Badge */}
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </span>
                {/* Doctor Info */}
                <div className="text-center mt-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {doc.name}
                  </h3>
                  <p className="text-blue-600 font-medium mt-1">
                    {doc.specialization}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {doc.experience} Experience
                  </p>
                </div>
                {/* Tags */}
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Video Consultation
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    MBBS, MD
                  </span>
                </div>
                {/* Rating */}
                <div className="flex justify-center mt-4 text-yellow-400">
                  ⭐ ⭐ ⭐ ⭐ ⭐
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                  <Link
                    to="/doctors"
                    className="inline-block px-6 py-3 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-blue-600 to-violet-600
                         hover:from-blue-700 hover:to-violet-700
                         shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
            {/* <div className="bg-gray-200 align-center justify-center bg-drop rounded-xl p-5 mt-8 flex gap-6 text-xl">
              <span>🩺 120+ Doctors</span>
              <span>🏥 20+ Departments</span>
              <span>⭐ 15k+ Patients</span>
            </div> */}
        </div>
      </section>

      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800 tracking-wide">
            What Our Patients Say
          </h2>

          {/* Testimonials Grid */}
          <div className="justify-center flex grid grid-col items-center  md:grid-cols-3 gap-10">
            {mockTestimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl flex flex-col items-center text-center
                     transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <p className="text-lg md:text-xl font-medium text-gray-800 italic mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <p className="text-md md:text-lg font-semibold text-blue-700">
                  - {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* Feedback */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Attention Text */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-wide">
                Share Your Feedback
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                Your opinion matters! Let us know about your experience,
                suggestions, or any improvements you’d like to see. We’re
                committed to providing the best healthcare experience for you.
              </p>
              <p className="text-gray-600 italic">
                “Your feedback helps us grow and serve you better.”
              </p>
            </div>

            {/* Right Side - Feedback Form */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-10">
              <form className="space-y-6">
                <textarea
                  placeholder="Tell us about your experience..."
                  className="w-full bg-white/10 backdrop-blur-lg p-4 border border-gray-300 rounded-xl h-48 focus:outline-none focus:ring-2  focus:border-transparent resize-none"
                />
                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition duration-300"
                  >
                    Send Feedback
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition duration-300"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* ************************************************************************************************************************************************************************************************************************************************ */}
      {/* Partners Section */}
      {/* 
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
            Trusted By
          </h3>

          {/* Logo Marquee */}
          {/* <div className="overflow-hidden relative">
            <div className="flex space-x-12 animate-scroll-logos hover:pause-scroll">
              <img
                src="/images/investment/pic1.jfif"
                alt="Partner 1"
                className="h-[20vh] opacity-90"
              />
              <img
                src="/images/investment/pic2.jfif"
                alt="Partner 2"
                className="h-[20vh] opacity-90"
              />
              <img
                src="/images/investment/pic3.jpg"
                alt="Partner 3"
                className="h-[20vh] opacity-90"
              />
              <img
                src="/images/investment/pic4.jfif"
                alt="Partner 4"
                className="h-[20vh] opacity-90"
              />
              <img
                src="/images/investment/pic5.jfif"
                alt="Partner 5"
                className="h-[20vh] opacity-90"
              />
              {/* Repeat logos for infinite effect */}
              {/* <img
                src="/images/investment/pic1.jfif"
                alt="Partner 1"
                className="h-[20vh] opacity-90"
              />
              <img
                src="/images/investment/pic2.jfif"
                alt="Partner 2"
                className="h-[20vh] opacity-90"
              />
            </div>
          </div> */}
        {/* </div> */}

        {/* Tailwind Custom CSS */}
         <style jsx>{`
        //   @keyframes scroll-logos {
        //     0% {
        //       transform: translateX(0);
        //     }
        //     100% {
        //       transform: translateX(-50%);
        //     }
        //   }
        //   .animate-scroll-logos {
        //     display: flex;
        //     animation: scroll-logos 20s linear infinite;
        //   }
        //   .hover\\:pause-scroll:hover {
        //     animation-play-state: paused;
        //   }
        // `}</style>
      {/* </section> */}

    </div>
  );
}
