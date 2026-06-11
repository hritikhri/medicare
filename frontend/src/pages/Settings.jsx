import { useState } from "react";
import ProfileUpdateForm from "../components/patient/ProfileUpdateForm";
import ChangePassword from "../components/auth/ChangePassword";
// import { UsersSecurity } from "./UsersSecurity";
import Security from "./Security";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileUpdateForm/>
      case "password":
        return <ChangePassword/>
      case "security":
        return <Security/>
      default:
        return null;
    }
  };

  return (
 <div className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* FIXED SIDEBAR */}
      <aside className="w-72 sticky top-0 h-[70vh] border-r overflow-hidden z-50">
           <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Settings
        </h2>

        <div className="space-y-1">
          <SettingItem
            label="Edit Profile"
            icon="👤"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SettingItem
            label="Change Password"
            icon="🔒"
            active={activeTab === "password"}
            onClick={() => setActiveTab("password")}
          />
          <SettingItem
            label="Security"
            icon="🛡️"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <main className="flex-1 pl-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto ">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

/* ---------- Reusable Item ---------- */
function SettingItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition
        ${
          active
            ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
