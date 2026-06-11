import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store.js';
import AppointmentHistory from '../shared/AppointmentHistory.jsx';

export default function DoctorDashboard() {
  const appointments = useSelector((state) => state.appointments.appointments);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
      <AppointmentHistory appointments={appointments.filter(a => a.doctorId === 'current_doctor_id')} />
      {/* Add chat list here */}
    </div>
  );
}