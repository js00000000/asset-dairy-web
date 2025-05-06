import React, { useState, useEffect } from "react";
import { ArrowLeft, DollarSign, Calendar, TrendingDown, User, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { fetchProfile, updateProfile } from './profile-api';
import { TimeHorizon } from './user-investment-profile-types';
import { useAuthStore } from '@/auth/auth-store';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

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
  const { showToast, ToastContainer } = useToast();

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
    try {
      setSaving(true);
      await updateProfile({
        ...form,
        investmentProfile: {
          ...form.investmentProfile,
          timeHorizon: form.investmentProfile.timeHorizon as TimeHorizon,
        },
      });
      showToast({
        message: 'Profile updated successfully!',
        type: 'success'
      });
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <a
            href="/profile"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </a>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-5">
            <Input
              type="text"
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              fullWidth
              leftIcon={<User className="w-5 h-5 text-blue-400" />}
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
              leftIcon={<User className="w-5 h-5 text-blue-400" />}
            />

            {/* Investment Profile Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-3 mb-4 border-b pb-2">
                <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
                Investment Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 rounded-2xl p-6">
                {[
                  { name: 'age', label: 'Age', icon: <User className="w-5 h-5 text-blue-400" />, type: 'number', min: 0, max: 120 },
                  { name: 'maxAcceptableShortTermLossPercentage', label: 'Risk Tolerance (%)', icon: <TrendingDown className="w-5 h-5 text-blue-400" />, type: 'number', min: 0, max: 100 },
                  { name: 'expectedAnnualizedRateOfReturn', label: 'Expected Annual Return (%)', icon: <DollarSign className="w-5 h-5 text-blue-400" />, type: 'number', min: 0, max: 100 },
                  { name: 'timeHorizon', label: 'Time Horizon', type: 'select', options: [
                    'Short-term (1-3 years)', 
                    'Medium-term (3-10 years)', 
                    'Long-term (10+ years)'
                  ] as const},
                  { name: 'yearsInvesting', label: 'Years Investing', icon: <Calendar className="w-5 h-5 text-blue-400" />, type: 'number', min: 0, max: 100 },
                  { name: 'monthlyCashFlow', label: 'Monthly Cash Flow', icon: <DollarSign className="w-5 h-5 text-blue-400" />, type: 'number', min: 0 },
                  { name: 'defaultCurrency', label: 'Default Currency', type: 'select', options: ['USD', 'TWD'] as const }
                ].map(({ name, label, icon, type, options = [], ...props }) => (
                  <div key={name} className={type === 'select' || name === 'yearsInvesting' ? 'col-span-full' : ''}>
                    {type === 'select' ? (
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">{label}</label>
                        <select
                          name={name}
                          value={form.investmentProfile[name as keyof typeof form.investmentProfile]}
                          onChange={handleChange}
                          className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                          required
                        >
                          <option value="">Select...</option>
                          {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Input
                        type={type}
                        name={name}
                        label={label}
                        value={form.investmentProfile[name as keyof typeof form.investmentProfile]}
                        onChange={handleChange}
                        required
                        leftIcon={icon}
                        fullWidth
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        {...props}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="p-6 pt-0">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition flex items-center justify-center"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>

        {/* Toast Notification */}
        {ToastContainer}

      </div>
    </div>
  );
};

export default ProfileEditPage;
