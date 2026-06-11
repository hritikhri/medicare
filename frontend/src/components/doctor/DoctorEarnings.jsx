const mockEarnings = [
  { month: 'Jan 2026', amount: 45000, appointments: 25 },
  { month: 'Dec 2025', amount: 42000, appointments: 22 },
  { month: 'Nov 2025', amount: 38000, appointments: 20 },
  { month: 'Oct 2025', amount: 41000, appointments: 23 }
];

export default function DoctorEarnings() {
  const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Earnings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <p className="text-3xl font-bold text-green-700">${totalEarnings}</p>
          <p className="text-sm text-green-600">Total Earnings</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-3xl font-bold text-blue-700">$4,500</p>
          <p className="text-sm text-blue-600">This Month</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <p className="text-3xl font-bold text-purple-700">90</p>
          <p className="text-sm text-purple-600">Billed Appointments</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockEarnings.map((earning, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{earning.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${earning.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.appointments}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
                  <button className="text-green-600 hover:text-green-900">Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}