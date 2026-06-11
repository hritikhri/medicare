import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/userSlice.js";
import {useNavigate} from 'react-router-dom'

export default function ProfileUpdateForm() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const [formData, setFormData] = useState(profile || {});
  const [file, setFile] = useState(null);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    try{
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (file) data.append("profilePic", file);
      // if(file) console.log(file)
      await dispatch(updateProfile(data));
      Navigate(-1);
    }catch(err){
      console.log(err);
    }
  };

return (
<div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">

  {/* FIXED HEADER */}
  <section className="h-30 relative overflow-hidden border-b border-slate-200 flex-shrink-0">

    {/* Background */}
    <div className="absolute rounded-lg inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />

    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-white rounded-full blur-3xl" />
    </div>

    {/* Content */}
    <div className="relative px-5 md:px-8 lg:px-12 py-10">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <p className="text-slate-400 uppercase tracking-[0.25em] text-[10px] mb-3">
            Account Settings
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Edit Profile
          </h1>

          <p className="text-slate-300 mt-3 text-sm max-w-2xl">
            Update your personal information and healthcare details.
          </p>

        </div>

      </div>

    </div>
  </section>

  {/* SCROLLABLE CONTENT */}
  <div className="flex-1 overflow-y-auto py-2 px-2">

    <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-[.5rem] overflow-hidden">

      {/* SECTION HEADER */}
      <div className="px-6 md:px-8 py-5 border-b border-slate-100">

        <h2 className="text-base font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Keep your information accurate for better medical services.
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="px-6 md:px-8 py-8 space-y-10"
      >

        {/* PROFILE IMAGE */}
        <section className="border-b border-slate-100 pb-8">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* IMAGE */}
            <div className="relative">

              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : formData.profilePic ||
                      "/images/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-3xl object-cover border border-slate-200 shadow-sm"
              />

            </div>

            {/* INPUT */}
            <div className="flex-1">

              <label className="block text-sm font-medium text-slate-700 mb-3">
                Profile Picture
              </label>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500
                file:mr-4 file:px-5 file:h-11
                file:border-0 file:rounded-2xl
                file:bg-blue-600 file:text-white
                file:text-sm file:font-medium
                hover:file:bg-blue-700"
              />

              <p className="text-xs text-slate-400 mt-3">
                JPG, PNG or WEBP recommended.
              </p>

            </div>

          </div>

        </section>

        {/* BASIC INFO */}
        <section className="border-b border-slate-100 pb-10">

          <div className="mb-6">

            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              BASIC DETAILS
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your personal information.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            <InputField
              label="Full Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <InputField
              label="Mobile Number"
              type="tel"
              value={formData.mobile || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobile: e.target.value,
                })
              }
            />

            {/* BLOOD GROUP */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Blood Group
              </label>

              <select
                value={formData.bloodGroup || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bloodGroup: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-2xl border border-slate-200
                bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>

            </div>

            <InputField
              label="Address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
            />

          </div>

        </section>

        {/* LOCATION */}
        <section>

          <div className="mb-6">

            <h2 className="text-sm font-semibold tracking-wide text-slate-900">
              LOCATION DETAILS
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your address and regional information.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <InputField
              label="City"
              value={formData.location?.city || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...(prev.location || {}),
                    city: e.target.value,
                  },
                }))
              }
            />

            <InputField
              label="State"
              value={formData.location?.state || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...(prev.location || {}),
                    state: e.target.value,
                  },
                }))
              }
            />

            <InputField
              label="Country"
              value={formData.location?.country || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...(prev.location || {}),
                    country: e.target.value,
                  },
                }))
              }
            />

            <InputField
              label="Pincode"
              value={formData.location?.pincode || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...(prev.location || {}),
                    pincode: e.target.value,
                  },
                }))
              }
            />

          </div>

        </section>

        {/* ACTIONS */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-4">

          <button
            type="button"
            className="h-11 px-6 rounded-2xl border border-slate-200
            text-slate-700 text-sm font-medium hover:bg-slate-100 transition"
          >
            Back
          </button>

          <button
            type="submit"
            className="h-11 px-7 rounded-2xl bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            Update Profile
          </button>

        </div>

      </form>

    </div>

  </div>

</div>
);
}

/* Reusable Input */
function InputField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 rounded-lg
        border border-slate-300
        focus:ring-2 focus:ring-blue-500
        outline-none transition"
      />
    </div>
  );
}