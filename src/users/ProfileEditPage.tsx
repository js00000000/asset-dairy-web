import React, { useState, useEffect } from "react";
import { UserCircle, Save, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { fetchProfile, updateProfile } from '../users/user-api';
import { useAuthStore } from '../users/auth-store';
import {
  RiskTolerance,
  InvestmentGoal,
  TimeHorizon,
  UserInvestmentProfile,
} from './user-investment-profile-types';

const ProfileEditPage: React.FC = () => {
  const { user } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    investmentProfile: {
      age: typeof user?.investmentProfile?.age === 'number' ? user.investmentProfile.age : 0,
      riskTolerance: (user?.investmentProfile?.riskTolerance as RiskTolerance) || 'Conservative',
      investmentGoal: (user?.investmentProfile?.investmentGoal as InvestmentGoal) || 'Growth',
      timeHorizon: (user?.investmentProfile?.timeHorizon as TimeHorizon) || 'Medium-term (3-10 years)',
      yearsInvesting: typeof user?.investmentProfile?.yearsInvesting === 'number' ? user.investmentProfile.yearsInvesting : 0,
    },
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile on mount (in case of refresh or store loss)
  useEffect(() => {
    async function loadProfile() {
      const latest = await fetchProfile();
      if (latest) {
        setForm({
          name: latest.name || '',
          username: latest.username || '',
          investmentProfile: {
            age: typeof latest.investmentProfile?.age === 'number' ? latest.investmentProfile.age : 0,
            riskTolerance: (latest.investmentProfile?.riskTolerance as RiskTolerance) || 'Conservative',
            investmentGoal: (latest.investmentProfile?.investmentGoal as InvestmentGoal) || 'Growth',
            timeHorizon: (latest.investmentProfile?.timeHorizon as TimeHorizon) || 'Medium-term (3-10 years)',
            yearsInvesting: typeof latest.investmentProfile?.yearsInvesting === 'number' ? latest.investmentProfile.yearsInvesting : 0,
          },
        });
        setAvatar(latest.avatar || '');
      }
    }
    loadProfile();
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (
      name === 'age' ||
      name === 'riskTolerance' ||
      name === 'investmentGoal' ||
      name === 'timeHorizon' ||
      name === 'yearsInvesting'
    ) {
      setForm({
        ...form,
        investmentProfile: {
          ...form.investmentProfile,
          [name]: type === 'number' || name === 'age' || name === 'yearsInvesting' ? Number(value) : value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };



  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Demo: show local preview only
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Persist profile (simulate avatar upload by just storing the preview URL)
      const updated = await updateProfile({
        ...form,
        avatar: avatar || user.avatar,
        investmentProfile: {
          ...form.investmentProfile,
        },
      });
      // Update zustand store directly with new user
      updateUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8 relative">
        <Link
          to="/profile"
          className="absolute left-6 top-6 flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg"
            />
            <label className="absolute bottom-2 right-2 bg-blue-100 p-2 rounded-full shadow cursor-pointer hover:bg-blue-200 transition-colors">
              <UserCircle className="w-6 h-6 text-blue-500" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="w-full space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <span>Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <span>Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                required
                minLength={2}
              />
            </div>
            {/* Investment Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/40 border border-blue-100 rounded-2xl p-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.investmentProfile.age}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  min={0}
                  max={120}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  Risk Tolerance
                </label>
                <select
                  name="riskTolerance"
                  value={form.investmentProfile.riskTolerance}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M12 4v16"/><path d="M6 8v8"/><path d="M3 12h3"/><path d="M18 8v8"/><path d="M21 12h-3"/></svg>
                  Investment Goal
                </label>
                <select
                  name="investmentGoal"
                  value={form.investmentProfile.investmentGoal}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Growth">Growth</option>
                  <option value="Income">Income</option>
                  <option value="Savings">Savings</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                  Time Horizon
                </label>
                <select
                  name="timeHorizon"
                  value={form.investmentProfile.timeHorizon}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Short-term (1-3 years)">Short-term (1-3 years)</option>
                  <option value="Medium-term (3-10 years)">Medium-term (3-10 years)</option>
                  <option value="Long-term (10+ years)">Long-term (10+ years)</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                  Years Investing
                </label>
                <input
                  type="number"
                  name="yearsInvesting"
                  value={form.investmentProfile.yearsInvesting}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  min={0}
                  max={100}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            {success && (
              <div className="text-green-600 font-semibold text-center mt-2 animate-pulse">
                Profile updated!
              </div>
            )}
            {error && (
              <div className="text-red-600 font-semibold text-center mt-2 animate-pulse">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
