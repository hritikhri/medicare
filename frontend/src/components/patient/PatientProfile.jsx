import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../redux/slices/userSlice";
import ProfileUpdateForm from "./ProfileUpdateForm";

export default function PatientProfile() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const data = await dispatch(fetchProfile()).unwrap();
      setUserData(data);
    };
    getProfile();
  }, [dispatch]);

  if (isEditing) {
    return <ProfileUpdateForm onClose={() => setIsEditing(false)} />;
  }

  const isProfileIncomplete =
    !userData?.name ||
    !userData?.email ||
    !userData?.mobile ||
    !userData?.bloodGroup ||
    !userData?.address;

return (
  <div className="min-h-fit bg-gradient-to-br from-slate-50 via-white to-blue-50">

    {/* HERO SECTION */}
    <section className="relative rounded-lg overflow-hidden border-b border-slate-200">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-white rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative px-5 md:px-8 lg:px-12 py-10">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <img
              src={
                userData?.profilePic ||
                "/images/default-avatar.png"
              }
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
              alt="Profile"
            />

            <div>

              <p className="text-slate-400 uppercase tracking-[0.25em] text-[10px] mb-2">
                User Profile
              </p>

              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                {userData?.name}
              </h1>

              <p className="text-slate-300 text-sm mt-2">
                {userData?.email}
              </p>

              <div className="flex items-center gap-3 mt-4">

                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-200 text-xs font-medium capitalize">
                  {userData?.role}
                </span>

                {!isProfileIncomplete ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/20 text-emerald-200 text-xs font-medium">
                    Profile Complete
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/20 text-amber-200 text-xs font-medium">
                    Incomplete
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <button
              onClick={() => setIsEditing(true)}
              className="h-11 px-6 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 transition text-sm font-medium shadow-lg"
            >
              Edit Profile
            </button>

          </div>

        </div>
      </div>
    </section>

    {/* MAIN CONTENT */}
    <section className="mt-2">

      <div className="max-w-7xl mx-auto">

        {/* ALERT */}
        {isProfileIncomplete && (
          <div className="mb-6 border border-amber-200 bg-amber-50 text-amber-700 rounded-2xl px-5 py-4 text-sm">
            Please complete your profile to get better medical assistance and improve account visibility.
          </div>
        )}

        {/* DETAILS */}
        <div className="bg-white border border-slate-200 pb-3 rounded-[2rem] overflow-hidden">

          {/* SECTION HEADER */}
          <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your personal and contact information
              </p>

            </div>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

            <ProfileItem
              label="Mobile Number"
              value={userData?.mobile}
            />

            <ProfileItem
              label="Blood Group"
              value={userData?.bloodGroup}
            />

            <ProfileItem
              label="Email Address"
              value={userData?.email}
            />

            <ProfileItem
              label="Address"
              value={userData?.address}
            />

            <ProfileItem
              label="City"
              value={userData?.location?.city}
            />

            <ProfileItem
              label="State"
              value={userData?.location?.state}
            />

          </div>

        </div>

      </div>
    </section>
  </div>
);
}

function ProfileItem({ label, value }) {
  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}
