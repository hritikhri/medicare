import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function DoctorProfileEdit({ doctor, onSaveSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", // ⚠️ usually comes from User model
    bio: "",
    specializations: [],
    experience: 0,
    consultationFee: 0,
    qualifications:[],
    consultationDuration: 15,
    languagesSpoken: [],
    clinic: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.userId?.name || "",
        bio: doctor.bio || "",
        specializations: doctor.specializations || [],
        experience: doctor.experience || 0,
        consultationFee: doctor.consultationFee || 0,
        consultationDuration: doctor.consultationDuration || 15,
        languagesSpoken: doctor.languagesSpoken || [],
        clinic: doctor.clinic || {},
        qualifications:doctor.qualifications||[],
      });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/doctors/profile/upload/data", formData);
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value]
    }));
  };

  const specializationsList = [
    "Cardiologist",
    "Dermatologist",
    "Orthopedic",
    "ENT",
    "General Physician",
    "Neurologist"
  ];

  const languageList = ["English", "Hindi", "Bengali", "Tamil", "Telugu"];

return (
  <div className="w-full min-h-screen bg-slate-50">

    {/* TOP HEADER */}
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      
      <div className="px-6 lg:px-10 py-5 flex items-center justify-between">
        
        <div>
          
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium">
            Doctor Profile
          </p>

          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            Edit Profile
          </h1>

        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
          
          <div className="w-2 h-2 rounded-full bg-blue-500" />

          <span className="text-[11px] font-medium text-blue-700">
            Professional Account
          </span>

        </div>

      </div>
    </div>

    {/* CONTENT */}
    <div className="px-6 lg:px-10 py-8">

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* BASIC INFO */}
        <section className="border-b border-slate-200 pb-10">

          <div className="mb-6">
            
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              BASIC INFORMATION
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your public doctor profile details.
            </p>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* NAME */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Doctor Name
              </label>

              <input
                type="text"
                value={formData.name}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
              />

              <p className="text-[11px] text-slate-400 mt-2">
                Name can be changed from account settings.
              </p>

            </div>

            {/* EXPERIENCE */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Experience (Years)
              </label>

              <input
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: +e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

          </div>

          {/* BIO */}
          <div className="mt-6">

            <label className="block text-xs font-medium text-slate-600 mb-2">
              Professional Bio
            </label>

            <textarea
              rows="5"
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              placeholder="Write about your experience, expertise and achievements..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

        </section>

        {/* SPECIALIZATION */}
        <section className="border-b border-slate-200 pb-10">

          <div className="mb-6">
            
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              SPECIALIZATIONS
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Select your medical expertise areas.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {specializationsList.map((spec) => (
              
              <label
                key={spec}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition text-sm
                ${
                  formData.specializations.includes(spec)
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                
                <input
                  type="checkbox"
                  checked={formData.specializations.includes(spec)}
                  onChange={() =>
                    toggleArrayValue("specializations", spec)
                  }
                  className="hidden"
                />

                {spec}

              </label>
            ))}

          </div>

        </section>

        {/* CONSULTATION */}
        <section className="border-b border-slate-200 pb-10">

          <div className="mb-6">
            
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              CONSULTATION
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Configure consultation fees and timing.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* FEE */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Consultation Fee (₹)
              </label>

              <input
                type="number"
                min="0"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultationFee: +e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

            {/* DURATION */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Duration (Minutes)
              </label>

              <input
                type="number"
                min="5"
                value={formData.consultationDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultationDuration: +e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

          </div>

        </section>

        {/* LANGUAGES */}
        <section className="border-b border-slate-200 pb-10">

          <div className="mb-6">
            
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              LANGUAGES SPOKEN
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Select languages you can communicate in.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {languageList.map((lang) => (
              
              <label
                key={lang}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition text-sm
                ${
                  formData.languagesSpoken.includes(lang)
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                
                <input
                  type="checkbox"
                  checked={formData.languagesSpoken.includes(lang)}
                  onChange={() =>
                    toggleArrayValue("languagesSpoken", lang)
                  }
                  className="hidden"
                />

                {lang}

              </label>
            ))}

          </div>

        </section>
         {/* QUALIFICATIONS */}
<section className="border-b border-slate-200 pb-10">

  <div className="mb-6">
    
    <h2 className="text-sm font-semibold tracking-wide text-slate-900">
      QUALIFICATIONS
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Add your educational and professional qualifications.
    </p>

  </div>

  <div className="space-y-5">

    {/* SHOW EXISTING QUALIFICATIONS */}
    {formData.qualifications &&
    formData.qualifications.length > 0 ? (

      formData.qualifications.map((q, index) => (

        <div
          key={index}
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-5 border border-slate-200 rounded-2xl bg-white"
        >

          {/* DEGREE */}
          <div>

            <label className="block text-xs font-medium text-slate-600 mb-2">
              Degree
            </label>

            <input
              type="text"
              placeholder="MBBS"
              value={q.degree || ""}
              onChange={(e) => {
                const updatedQualifications = [...formData.qualifications];

                updatedQualifications[index].degree = e.target.value;

                setFormData({
                  ...formData,
                  qualifications: updatedQualifications,
                });
              }}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

          </div>

          {/* UNIVERSITY */}
          <div>

            <label className="block text-xs font-medium text-slate-600 mb-2">
              University
            </label>

            <input
              type="text"
              placeholder="AIIMS Delhi"
              value={q.university || ""}
              onChange={(e) => {
                const updatedQualifications = [...formData.qualifications];

                updatedQualifications[index].university = e.target.value;

                setFormData({
                  ...formData,
                  qualifications: updatedQualifications,
                });
              }}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

          </div>

          {/* YEAR */}
          <div>

            <label className="block text-xs font-medium text-slate-600 mb-2">
              Year
            </label>

            <input
              type="number"
              placeholder="2025"
              value={q.year || ""}
              onChange={(e) => {
                const updatedQualifications = [...formData.qualifications];

                updatedQualifications[index].year = e.target.value;

                setFormData({
                  ...formData,
                  qualifications: updatedQualifications,
                });
              }}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

          </div>

          {/* REMOVE */}
          <div className="flex items-end">

            <button
              type="button"
              onClick={() => {
                const updatedQualifications =
                  formData.qualifications.filter((_, i) => i !== index);

                setFormData({
                  ...formData,
                  qualifications: updatedQualifications,
                });
              }}
              className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition"
            >
              Remove
            </button>

          </div>

        </div>

      ))
    ) : (

      <div className="text-sm text-slate-400 italic">
        No qualifications added yet.
      </div>

    )}

    {/* ADD BUTTON */}
    {formData.qualifications.length < 3 && (
      
      <button
        type="button"
        onClick={() => {
          setFormData({
            ...formData,
            qualifications: [
              ...formData.qualifications,
              {
                degree: "",
                university: "",
                year: "",
              },
            ],
          });
        }}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
      >
        + Add Qualification
      </button>

    )}

    {/* LIMIT MESSAGE */}
    {formData.qualifications.length >= 3 && (
      
      <p className="text-xs text-amber-600 font-medium">
        Maximum 3 qualifications allowed.
      </p>

    )}

  </div>

</section>
        {/* CLINIC */}
        <section className="pb-10">

          <div className="mb-6">
            
            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              CLINIC INFORMATION
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update clinic or hospital details.
            </p>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CLINIC NAME */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Clinic Name
              </label>

              <input
                type="text"
                value={formData.clinic.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clinic: {
                      ...formData.clinic,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

            {/* ADDRESS */}
            <div>

              <label className="block text-xs font-medium text-slate-600 mb-2">
                Clinic Address
              </label>

              <input
                type="text"
                value={formData.clinic.address || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clinic: {
                      ...formData.clinic,
                      address: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

          </div>

        </section>

        {/* ACTIONS */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-4 -mx-6 lg:-mx-10 flex items-center justify-end gap-4">

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  </div>
);
}
