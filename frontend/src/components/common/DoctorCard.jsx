import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <img
        src={doctor.userId?.profilePic || '/images/doctor1.jpg'}
        alt={doctor.userId?.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{doctor.userId?.name}</h3>
      <p className="text-gray-600 mb-1">{doctor.specializations?.join(', ')}</p>
      <p className="text-gray-500 mb-2">{doctor.userId?.location?.city}</p>
      <p className="text-green-600 font-semibold mb-4">${doctor.consultationFee}/session</p>
      <p className="text-yellow-500 mb-4">⭐ {doctor.ratings?.average || 0}</p>
      <Link
        to={`/doctors/${doctor._id}`}
        className="w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        View Profile & Book
      </Link>
    </div>
  );
}