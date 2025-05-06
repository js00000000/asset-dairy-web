import React, { useState, useEffect } from "react";
import { UserCircle, Save, ArrowLeft, DollarSign, Calendar, Percent, User } from "lucide-react";
import { Navigate } from "react-router-dom";
import { fetchProfile, updateProfile } from './profile-api';
import { TimeHorizon } from './user-investment-profile-types';
import { useAuthStore } from '@/auth/auth-store';
import Input from '@/components/ui/Input';

const ProfileEditPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const [form, setForm] = useState({
    name: '',
    username: '',
    investmentProfile: {
      age: 0,
      maxAcceptableShortTermLossPercentage: 20,
      expectedAnnualizedRateOfReturn: 8,
      timeHorizon: 'Medium-term (3-10 years)',
      yearsInvesting: 0,
      monthlyCashFlow: 0,
      defaultCurrency: 'USD',
    },
  });
  
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
            maxAcceptableShortTermLossPercentage: typeof latest.investmentProfile?.maxAcceptableShortTermLossPercentage === 'number' ? latest.investmentProfile.maxAcceptableShortTermLossPercentage : 20,
            expectedAnnualizedRateOfReturn: typeof latest.investmentProfile?.expectedAnnualizedRateOfReturn === 'number' ? latest.investmentProfile.expectedAnnualizedRateOfReturn : 8,
            timeHorizon: (latest.investmentProfile?.timeHorizon as TimeHorizon) || 'Medium-term (3-10 years)',
            yearsInvesting: typeof latest.investmentProfile?.yearsInvesting === 'number' ? latest.investmentProfile.yearsInvesting : 0,
            monthlyCashFlow: typeof latest.investmentProfile?.monthlyCashFlow === 'number' ? latest.investmentProfile.monthlyCashFlow : 0,
            defaultCurrency: latest.investmentProfile?.defaultCurrency || 'USD',
          },
        });
      }
    }
    loadProfile();
  }, []);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (
      name === 'age' ||
      name === 'maxAcceptableShortTermLossPercentage' ||
      name === 'expectedAnnualizedRateOfReturn' ||
      name === 'timeHorizon' ||
      name === 'yearsInvesting' ||
      name === 'monthlyCashFlow' ||
      name === 'defaultCurrency'
    ) {
      setForm({
        ...form,
        investmentProfile: {
          ...form.investmentProfile,
          [name]: type === 'number' || name === 'age' || name === 'yearsInvesting' || name === 'expectedAnnualizedRateOfReturn' || name === 'maxAcceptableShortTermLossPercentage' || name === 'monthlyCashFlow' ? Number(value) : value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        ...form,
        investmentProfile: {
          ...form.investmentProfile,
          timeHorizon: form.investmentProfile.timeHorizon as TimeHorizon,
        },
      });
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
        <a
          href="/profile"
          className="absolute left-6 top-6 flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </a>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-6">
          <div className="relative">
            <span className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-100 border-4 border-blue-300 shadow-lg">
              <UserCircle className="w-20 h-20 text-blue-400" />
            </span>
          </div>
          <div className="w-full space-y-5">
            <Input
              type="text"
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              fullWidth
            />
            <Input
              type="text"
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={2}
              fullWidth
            />
            {/* Investment Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/40 border border-blue-100 rounded-2xl p-6 mb-6">
              <Input
                type="number"
                name="age"
                label="Age"
                value={form.investmentProfile.age}
                onChange={handleChange}
                min={0}
                max={120}
                required
                leftIcon={<User className="w-5 h-5 text-blue-400" />}
                fullWidth
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Input
                type="number"
                name="maxAcceptableShortTermLossPercentage"
                label="Risk Tolerance"
                value={form.investmentProfile.maxAcceptableShortTermLossPercentage}
                onChange={handleChange}
                min={0}
                max={100}
                required
                rightIcon={<Percent className="w-5 h-5 text-blue-400" />}
                fullWidth
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Input
                type="number"
                name="expectedAnnualizedRateOfReturn"
                label="Expected Annualized Rate of Return (%)"
                value={form.investmentProfile.expectedAnnualizedRateOfReturn}
                onChange={handleChange}
                min={0}
                max={100}
                required
                rightIcon={<Percent className="w-5 h-5 text-blue-400" />}
                fullWidth
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
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
                <Input
                  type="number"
                  name="yearsInvesting"
                  label="Years Investing"
                  value={form.investmentProfile.yearsInvesting}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  required
                  leftIcon={<Calendar className="w-5 h-5 text-blue-400" />}
                  fullWidth
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <Input
                type="number"
                name="monthlyCashFlow"
                label="Monthly Cash Flow"
                value={form.investmentProfile.monthlyCashFlow}
                onChange={handleChange}
                min={0}
                required
                leftIcon={<DollarSign className="w-5 h-5 text-blue-400" />}
                fullWidth
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  Default Currency
                </label>
                <select
                  name="defaultCurrency"
                  value={form.investmentProfile.defaultCurrency}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="TWD">TWD</option>
                </select>
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
