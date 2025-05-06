import React, { useEffect, useState } from "react";
import { Mail, Loader2, Trash2, User as UserIcon, TrendingDown, Clock, Calendar, DollarSign, CreditCard } from "lucide-react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { fetchProfile, deleteProfile } from './profile-api';
import { useToast } from '@/lib/toast';
import type { User } from './user-types';
import { useAuthStore } from '@/auth/auth-store';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const [user, updateUser ] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      setIsDeleting(true);
      try {
        const success = await deleteProfile(); // This function needs to be implemented in profile-api.ts
        if (success) {
          toast.success("Your account has been successfully deleted.");
          logout();
          navigate('/');
        } else {
          toast.error("Failed to delete account. Please try again or contact support.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred while deleting your account. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header with Profile Picture and Basic Info */}
        <div className="bg-blue-600 text-white p-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold">{user?.name}</h2>
          <div className="text-white/80 font-mono text-sm mt-1">@{user?.username}</div>
          <div className="flex items-center gap-2 mt-3 text-white/90">
            <Mail className="w-5 h-5" />
            <span>{user?.email}</span>
          </div>
        </div>

        {/* Investment Profile Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-3 mb-4 border-b pb-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Investment Profile
          </h3>
          {user?.investmentProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 rounded-2xl p-6">
              {[
                { icon: <UserIcon className="w-5 h-5 text-blue-400" />, label: 'Age', value: user.investmentProfile.age },
                { icon: <TrendingDown className="w-5 h-5 text-blue-400" />, label: 'Max Short-Term Loss (%)', value: user.investmentProfile.maxAcceptableShortTermLossPercentage },
                { icon: <DollarSign className="w-5 h-5 text-blue-400" />, label: 'Expected Annual Return (%)', value: user.investmentProfile.expectedAnnualizedRateOfReturn },
                { icon: <Clock className="w-5 h-5 text-blue-400" />, label: 'Time Horizon', value: user.investmentProfile.timeHorizon },
                { icon: <Calendar className="w-5 h-5 text-blue-400" />, label: 'Years Investing', value: user.investmentProfile.yearsInvesting },
                { icon: <DollarSign className="w-5 h-5 text-blue-400" />, label: 'Monthly Cash Flow', value: user.investmentProfile.monthlyCashFlow.toLocaleString() },
                { icon: <CreditCard className="w-5 h-5 text-blue-400" />, label: 'Default Currency', value: user.investmentProfile.defaultCurrency, fullWidth: true }
              ].map(({ icon, label, value, fullWidth = false }) => (
                <div key={label} className={`flex items-center gap-3 text-gray-700 ${fullWidth ? 'col-span-full' : ''}`}>
                  {icon}
                  <span className="font-medium">{label}:</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-6 text-center text-blue-500">
              No investment profile set.<br />
              <Link to="/profile/edit" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition">Set Investment Profile</Link>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end gap-4 border-t">
          <Link
            to="/profile/change-password"
            className="flex items-center justify-center gap-2 bg-white border border-blue-300 hover:bg-blue-50 text-blue-600 font-semibold px-5 py-2 rounded-lg shadow transition-colors w-full sm:w-auto"
            aria-label="Change Password"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change Password
          </Link>
          <Link
            to="/profile/edit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition w-full sm:w-auto"
            aria-label="Edit Profile"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            aria-label="Delete Account"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
