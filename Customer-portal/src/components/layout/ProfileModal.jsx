import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

const ProfileModal = ({ onClose }) => {
  const { user, getAuthHeader, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile(getAuthHeader());

      if (data.success) {
        setProfileData(data.data);
        setFormData({
          email: data.data.email,
          businessName: data.data.businessName,
          contactNumber: data.data.contactNumber,
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (err) {
        toast.error(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authService.updateProfile(formData, getAuthHeader());

      if (data.success) {
        setProfileData(data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      email: profileData.email,
      businessName: profileData.businessName,
      contactNumber: profileData.contactNumber,
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-4xl" />
              <div>
                <h2 className="text-2xl font-bold">Profile</h2>
                <p className="text-red-100">{user?.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-red-500 p-2 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {loading && !profileData ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-300 transition-colors">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 font-medium">Username</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.username}</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-300 transition-colors">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 font-medium">Role</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.role}</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-300 transition-colors">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 font-medium">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.email}</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-300 transition-colors">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 font-medium">Contact Number</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.contactNumber}</p>
                </div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-300 transition-colors md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5 font-medium">Business Name</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.businessName}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    toast.success('Logged out successfully!');
                    onClose();
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;