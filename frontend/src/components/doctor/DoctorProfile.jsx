import { useEffect, useState } from "react";
import api from "../../utils/api";
import DoctorProfileEdit from "./DoctorProfileEdit";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/doctors/profile/data");
      setDoctor(res.data);
    } catch (err) {
      console.error("Fetch doctor profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!doctor) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  // 🔁 Edit Mode
  if (isEditing) {
    return (
      <DoctorProfileEdit
        doctor={doctor}
        onCancel={() => setIsEditing(false)}
        onSaveSuccess={() => {
          fetchProfile();
          setIsEditing(false);
        }}
      />
    );
  }

  const isProfileIncomplete =
    !doctor.bio ||
    !doctor.specializations?.length ||
    !doctor.experience ||
    !doctor.consultationFee ||
    !doctor.clinic?.address;

return (
 <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-2 md:p-4">

  {/* HERO SECTION */}
  <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm">

    {/* BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-300 rounded-full blur-3xl" />
    </div>

    {/* CONTENT */}
    <div className="relative px-5 md:px-7 py-5">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        {/* LEFT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          {/* IMAGE */}
          <div className="relative shrink-0">

            <img
              src={doctor.profilePic}
              alt="Doctor"
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white/30 shadow-2xl"
            />

            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-semibold shadow-lg">
                ✓ Verified
              </div>
            )}

          </div>

          {/* INFO */}
          <div>

            <p className="text-blue-100 uppercase tracking-[0.25em] text-[10px] mb-2">
              Doctor Profile
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {doctor.userId?.name}
            </h1>

            <p className="text-sm md:text-base text-blue-100 mt-1">
              {doctor.specializations?.join(", ") || "Specialist"}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-4">

              <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xl text-white text-[11px] border border-white/10">
                {doctor.department}
              </span>

              <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xl text-white text-[11px] border border-white/10">
                {doctor.experience} Years
              </span>

              <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xl text-white text-[11px] border border-white/10">
                ₹{doctor.consultationFee}
              </span>

            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-2xl bg-white text-blue-700 text-sm font-semibold shadow-lg hover:bg-blue-50 transition-all"
          >
            Edit Profile
          </button>

        </div>

      </div>
    </div>
  </section>

  {/* MAIN CONTENT */}
  <section className="mt-4">

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

      {/* LEFT SIDE */}
      <div className="xl:col-span-2 space-y-4">

        {/* ABOUT */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              About Doctor
            </h2>

            <div className="w-10 h-1 rounded-full bg-blue-600" />

          </div>

          <p className="text-sm text-slate-600 leading-7">
            {doctor.bio || "No bio available yet."}
          </p>

        </div>

        {/* QUALIFICATIONS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Qualifications
            </h2>

            <div className="w-10 h-1 rounded-full bg-indigo-600" />

          </div>

          <div className="space-y-3">

            {doctor.qualifications?.length ? (
              doctor.qualifications.map((q, i) => (

                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition"
                >

                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    🎓
                  </div>

                  <div>

                    <h4 className="font-semibold text-sm text-slate-900">
                      {q.degree}
                    </h4>

                    <p className="text-sm text-slate-600 mt-0.5">
                      {q.university}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1">
                      Graduated in {q.year}
                    </p>

                  </div>

                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No qualifications added yet.
              </p>
            )}

          </div>

        </div>

        {/* WARNING */}
        {isProfileIncomplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">

            <div className="text-2xl">
              ⚠️
            </div>

            <div>

              <h3 className="font-semibold text-sm text-amber-900">
                Complete Your Profile
              </h3>

              <p className="text-amber-700 mt-1 text-sm leading-6">
                Completing your profile improves trust and visibility.
              </p>

            </div>

          </div>
        )}

      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-4">

        {/* QUICK INFO */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">

          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Quick Information
          </h3>

          <div className="space-y-4">

            <InfoRow
              label="Experience"
              value={`${doctor.experience} Years`}
            />

            <InfoRow
              label="Consultation"
              value={`₹${doctor.consultationFee}`}
            />

            <InfoRow
              label="Duration"
              value={`${doctor.consultationDuration} Min`}
            />

            <InfoRow
              label="Languages"
              value={doctor.languagesSpoken?.join(", ")}
            />

          </div>

        </div>

        {/* CLINIC */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">

          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative">

            <p className="text-slate-400 uppercase tracking-[0.25em] text-[10px] mb-2">
              Clinic Address
            </p>

            <h3 className="text-xl font-bold">
              {doctor.clinic?.city}
            </h3>

            <p className="text-sm text-slate-300 mt-3 leading-6">
              {doctor.clinic?.address}
            </p>

          </div>

        </div>

      </div>

    </div>
  </section>

</div>
);
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}
