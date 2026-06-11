import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice.js';
import { 
  User, Search, Calendar, Bot, Settings, LogOut , LayoutDashboard
} from 'lucide-react';

import DoctorList from '../components/shared/DoctorList.jsx';
import AppointmentHistory from '../components/shared/AppointmentHistory.jsx';
import HealthAssistant from '../components/patient/HealthAssistant.jsx';
import PatientProfile from '../components/patient/PatientProfile.jsx';
import api from '../utils/api.js';
import PatientOverview from './PatientOverview.jsx';

export default function PatientDashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setappointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  useEffect(()=>{
     
    Getappointments();
  },[])

  const Getappointments = async ()=>{
    const res = (await api.get("/appointments"));
    console.log(res)
    setappointments(res.data.appointments)
  }


  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <PatientOverview user = {user}/>;
      case 'profile':
        return <PatientProfile />;
      case 'doctors':
        return <DoctorList filters={{ location: user?.location?.city }} />;
      case 'appointments':
        return <AppointmentHistory appointments = {appointments} />;
      // case 'assistant':
      //   return <HealthAssistant />;
      default:
        return <PatientOverview appointments = {appointments} user = {user}/>;
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* FIXED SIDEBAR */}
      <aside className="w-72 sticky top-0 h-[70vh] border-r overflow-hidden z-50">
        
        {/* Header */}
        

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'profile', label: 'Profile', icon: User },
            { key: 'doctors', label: 'Find Doctors', icon: Search },
            { key: 'appointments', label: 'Appointments', icon: Calendar },
            // { key: 'assistant', label: 'Health Assistant', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl text-left transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-all ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                <span className="font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-100 flex-shrink-0 space-y-2 bg-white/95">
          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50 pl-10">
        <div className="max-w-7xl mx-auto">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}