import React from 'react';
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from 'react-icons/fa';
import LibrarianSidebar from '../sideNav';
import LibrarianHeader from '../header';

const staticNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'Your profile was updated successfully.',
    createdAt: '2025-05-04T10:30:00Z',
  },
  {
    id: 2,
    type: 'success',
    message: 'Booking for Lab A confirmed.',
    createdAt: '2025-05-03T15:45:00Z',
  },
  {
    id: 3,
    type: 'warning',
    message: 'Room B is almost full. Consider early booking.',
    createdAt: '2025-05-02T09:00:00Z',
  },
  {
    id: 4,
    type: 'error',
    message: 'Payment for equipment failed. Try again.',
    createdAt: '2025-05-01T18:20:00Z',
  },
];

const iconMap = {
  info: <FaInfoCircle className="text-blue-500 text-xl" />,
  success: <FaCheckCircle className="text-green-500 text-xl" />,
  warning: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
  error: <FaTimesCircle className="text-red-500 text-xl" />,
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} • ${timeStr}`;
};

const LibrarianNotificationScreen = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <LibrarianSidebar />
      <div className="flex-1 ml-[250px]">
        <LibrarianHeader />
        <div className="pt-[100px] px-8">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>

          {staticNotifications.length === 0 ? (
            <div className="text-gray-500 text-center py-20">No notifications available.</div>
          ) : (
            <div className="space-y-4">
              {staticNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="mr-4">
                    {iconMap[notification.type] || <FaInfoCircle className="text-gray-400 text-xl" />}
                  </div>
                  <div>
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-gray-400 text-sm">{formatDateTime(notification.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianNotificationScreen;
