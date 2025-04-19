import React, { useEffect, useState } from "react";
import { UserCircle, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from '../modules/auth/auth-store';
import { fetchProfile } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncProfile() {
      setLoading(true);
      const latest = await fetchProfile();
      if (latest) {
        updateUser(latest);
      }
      setLoading(false);
    }
    syncProfile();
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">No profile found</h2>
          <p className="text-gray-500 mb-6">You must be logged in to view your profile.</p>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Go to Login</Link>
        </div>
      </div>
    );
  }
  const { avatar, name, username, email, role } = user;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-8 relative">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg"
            />
            <span className="absolute bottom-2 right-2 bg-blue-100 p-2 rounded-full shadow">
              <UserCircle className="w-6 h-6 text-blue-500" />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <div className="text-gray-500 font-mono text-sm">@{username}</div>
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            {role}
          </span>
        </div>
        <div className="flex flex-col gap-2 w-full mt-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-blue-400" />
            <span>{email}</span>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <Link
            to="/profile/change-password"
            className="flex items-center gap-2 bg-white border border-blue-300 hover:bg-blue-50 text-blue-600 font-semibold px-5 py-2 rounded-lg shadow transition-colors"
            aria-label="Change Password"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change Password
          </Link>
          <Link
            to="/profile/edit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition flex items-center justify-center"
            aria-label="Edit Profile"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
