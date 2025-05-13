import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import LibrarianSidebar from '../sideNav';
import LibrarianHeader from '../header';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} • ${timeStr}`;
};

const LibrarianProfileScreen = () => {
  const { user, isAuthenticated } = useSelector(state => state.user);

  // useEffect(() => {
  //   console.log('User Profile:', user);
  // });
  return (
    <div className="flex bg-gray-50 min-h-screen">
            <LibrarianSidebar />

      <div className="flex-1 ml-[250px]">
      <LibrarianHeader />
      <div className="pt-[80px] px-8">
            <br></br>
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Professional Profile</h1>

          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
            {/* Profile Picture and Info */}
            <div className="flex items-center space-x-6">
            <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=100`}
                    alt="Profile Picture"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user?.name || 'N/A'}</h2>
                <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Name:</p>
                    <p className="text-gray-600">{user?.name || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Email:</p>
                    <p className="text-gray-600">{user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Role:</p>
                    <p className="text-gray-600">{user?.role || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Joined:</p>
                    <p className="text-gray-600">{user?.createdAt ? formatDateTime(user?.createdAt) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Phone:</p>
                    <p className="text-gray-600">{user?.phone || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Address:</p>
                    <p className="text-gray-600">{user?.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">LinkedIn:</p>
                    <p className="text-gray-600">{user?.linkedin || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Website:</p>
                    <p className="text-gray-600">{user?.website || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianProfileScreen;
