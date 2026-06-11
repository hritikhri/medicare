import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import BookAppointment from "../components/shared/BookAppointment";
import { DoctorNotFound } from "../components/common/DoctorNotFound";
import { DoctorProfileLoading } from "../components/common/DoctorProfileLoading";
import { useState } from "react";

/* ------------------ Main Page ------------------ */
export default function DoctorProfileByID() {
  const { id } = useParams();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => api.get(`/doctors/get/${id}`).then((res) => res.data),
  });

  if (isLoading) return <DoctorProfileLoading />;
  if (!doctor) return <DoctorNotFound />;
  // if(doctor) console.log(doctor.clinic)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ------------------ Left: Doctor Info ------------------ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow border p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={doctor.userId?.profilePic}
                alt={doctor.userId?.name}
                className="w-32 h-32 rounded-full object-cover border"
              />

              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {doctor.userId?.name}
                </h1>

                <p className="text-blue-600 font-medium mt-1">
                  {doctor.specializations?.join(", ")}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                  <span>🩺 {doctor.experience}+ years experience</span>
                  <span>📍 {doctor.clinic?.city || "India"}</span>
                  <span>🗣 {doctor.languagesSpoken?.join(", ")}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {doctor.ratings?.average || 0}/5
                  </span>
                  <span className="text-sm text-gray-500">
                    ({doctor.ratings?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* About Doctor */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 text-lg">🩺</span>
                <h3 className="text-lg font-semibold text-slate-800">
                  About Doctor
                </h3>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm">
                {doctor.bio || "No description provided."}
              </p>
            </div>

            {/* Clinic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-600 text-lg">🏥</span>
                <h3 className="text-lg font-semibold text-slate-800">
                  Clinic Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="text-slate-500 text-xs">Clinic</span>
                  <p className="font-medium">{doctor.clinic?.name || "—"}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="text-slate-500 text-xs">Address</span>
                  <p className="font-medium">{doctor.clinic?.address || "—"}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="text-slate-500 text-xs">City</span>
                  <p className="font-medium">{doctor.clinic?.city || "—"}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="text-slate-500 text-xs">Pincode</span>
                  <p className="font-medium">{doctor.clinic?.pincode || "—"}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500 text-lg">⭐</span>
                <h3 className="text-lg font-semibold text-slate-800">
                  Patient Reviews
                </h3>
              </div>

              {doctor.reviews?.length ? (
                <div className="space-y-4">
                  {doctor.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                    >
                      <p className="text-sm font-medium text-slate-800 mb-1">
                        ⭐ {review.rating}/5
                      </p>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* ------------------ Right: Book Appointment ------------------ */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Book Appointment</h3>

            <p className="text-gray-600 text-sm mb-4">Consultation Fee</p>

            <p className="text-2xl font-bold text-green-600 mb-4">
              ₹{doctor.consultationFee}
            </p>

            <BookAppointment doctorId={id} />

            <p className="text-xs text-gray-500 mt-4">
              ✔ Instant confirmation <br />
              ✔ Verified doctor <br />✔ Secure payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
