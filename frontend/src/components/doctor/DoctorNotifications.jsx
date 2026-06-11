import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket.js';

const mockNotifications = [
  { id: 1, message: 'New appointment booked by John Doe', type: 'appointment', time: '2 min ago' },
  { id: 2, message: 'Payment received for Jane Smith', type: 'payment', time: '1 hour ago' },
  { id: 3, message: 'Appointment cancelled by Bob Johnson', type: 'cancellation', time: '3 hours ago' }
];

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const socket = useSocket();  // From hook

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
    }

    return () => socket?.off('notification');
  }, [socket]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border ${
              notif.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                notif.type === 'appointment' ? 'bg-blue-500' : 
                notif.type === 'payment' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications yet.
        </div>
      )}
    </div>
  );
}