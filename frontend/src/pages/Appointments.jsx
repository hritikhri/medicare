import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store.js';
import AppointmentHistory from '../components/shared/AppointmentHistory.jsx';

export default function Appointments() {
  const appointments = useSelector((state) => state.appointments.appointments);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>
      <AppointmentHistory appointments={appointments} />
    </div>
  );
}