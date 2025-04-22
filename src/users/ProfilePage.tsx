import React, { useEffect, useState } from "react";
import { UserCircle, Mail, Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from '../users/auth-store';
import { fetchProfile } from '../users/user-api';

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
    return <Navigate to="/" replace />;
  }
  const { avatar, name, username, email} = user;
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
        </div>
        <div className="flex flex-col gap-2 w-full mt-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-blue-400" />
            <span>{email}</span>
          </div>
        </div>

        {/* Investment Profile Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Investment Profile
          </h3>
          {user.investmentProfile ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span>Age:</span>
                <span className="font-semibold">{user.investmentProfile.age}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span>Max Acceptable Short-Term Loss (%):</span>
                <span className="font-semibold">{user.investmentProfile.maxAcceptableShortTermLossPercentage}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M12 4v16"/><path d="M6 8v8"/><path d="M3 12h3"/><path d="M18 8v8"/><path d="M21 12h-3"/></svg>
                <span>Expected Annualized Rate of Return (%):</span>
                <span className="font-semibold">{user.investmentProfile.expectedAnnualizedRateOfReturn}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                <span>Time Horizon:</span>
                <span className="font-semibold">{user.investmentProfile.timeHorizon}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 col-span-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Years Investing:</span>
                <span className="font-semibold">{user.investmentProfile.yearsInvesting}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-6 text-center text-blue-500">
              No investment profile set.<br />
              <Link to="/profile/edit" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition">Set Investment Profile</Link>
            </div>
          )}
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
