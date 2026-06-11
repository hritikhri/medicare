import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, Calendar, Users, User, Settings, 
  Stethoscope 
} from 'lucide-react';

import DoctorStats from '../components/doctor/DoctorStats.jsx';
import DoctorAppointments from '../components/doctor/DoctorAppointments.jsx';
import DoctorPatients from '../components/doctor/DoctorPatients.jsx';
import DoctorProfile from '../components/doctor/DoctorProfile.jsx';
import DoctorSettings from '../components/doctor/DoctorSettings.jsx';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { role, name } = useSelector((state) => state.auth.user || {});

  if (role !== 'doctor') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-red-500 font-medium">
        Access denied - Doctor dashboard only.
      </div>
    );
  }

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'appointments', label: 'Appointments', icon: Calendar },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <DoctorStats />;
      case 'appointments': return <DoctorAppointments />;
      case 'patients': return <DoctorPatients />;
      case 'profile': return <DoctorProfile />;
      case 'settings': return <DoctorSettings />;
      default: return <DoctorStats />;
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* FIXED SIDEBAR - Never Scrolls */}
      <aside className="w-72 sticky top-0 h-[70vh] border-r overflow-hidden z-50">
        {/* Menu Label - Fixed */}
        <div className="px-6 pt-8 pb-4 flex-shrink-0">
          <p className="text-slate-500 text-sm pl-4 mb-3 tracking-widest">MAIN MENU</p>
        </div>

        {/* Navigation - Scrollable only if needed (currently few items) */}
        <nav className="flex-1 px-4 pb-5 space-y-1 overflow-y-hidden custom-scrollbar">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl text-left transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.00]' 
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                  }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-all duration-200 
                    ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} 
                />
                <span className="font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Info - Always Fixed at Bottom */}
        {/* <div className="p-6 border-t border-slate-100 flex-shrink-0 bg-white/95">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div> */}
      </aside>

      {/* SCROLLABLE RIGHT SIDE - Only This Area Scrolls */}
      <main className="flex-1 overflow-y-auto pl-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}