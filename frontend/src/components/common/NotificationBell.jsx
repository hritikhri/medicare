import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store.js';
import { useSocket } from '../../hooks/useSocket.js';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const userId = useSelector((state) => state.auth.user?.id);
  const socket = useSocket(userId);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
    }

    return () => {
      socket?.off('notification');
    };
  }, [socket]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-blue-600"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.map((notif, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <p className="font-semibold">{notif.type}</p>
              <p>{notif.message}</p>
              <small className="text-gray-500">{new Date(notif.timestamp).toLocaleString()}</small>
            </div>
          ))}
          {notifications.length === 0 && <p className="p-4 text-center text-gray-500">No notifications</p>}
        </div>
      )}
    </div>
  );
}