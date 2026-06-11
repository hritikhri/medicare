import DoctorList from '../components/shared/DoctorList.jsx';

export default function Doctors() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>
      <DoctorList filters={{}} />
    </div>
  );
}