import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PublicLayout from './components/layout/PublicLayout.jsx';
import ProtectedLayout from './components/layout/ProtectedLayout.jsx';

import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import Doctors from './pages/Doctors.jsx';
import DoctorProfileByID from './pages/DoctorProfileByID.jsx';
import Appointments from './pages/Appointments.jsx';
import ProfileUpdateForm from './components/patient/ProfileUpdateForm.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import Settings from './pages/Settings.jsx';
import DashboardRedirect from './components/layout/DashboardRedirect.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfileByID />} />
            <Route path="/appointments" element={<Appointments />} />

            <Route path="/profile/edit" element={<ProfileUpdateForm />} />
            <Route path="/profile/change-password" element={<ProfileUpdateForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
