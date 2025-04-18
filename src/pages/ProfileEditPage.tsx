import React, { useState, useEffect } from "react";
import { UserCircle, Mail, MapPin, Phone, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProfile, updateProfile } from '../services/api';
import { useAuthStore } from '../store/auth-store';

const ProfileEditPage: React.FC = () => {
  const { user } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [form, setForm] = useState({
    name: user?.name || '',
    address: user?.address || '',
    phone: user?.phone || '',
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
          address: latest.address || '',
          phone: latest.phone || '',
        });
        setAvatar(latest.avatar || '');
      }
    }
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">No profile found</h2>
          <p className="text-gray-500 mb-6">You must be logged in to edit your profile.</p>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                required
                minLength={5}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Contact Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                required
                // Pattern validation removed due to browser compatibility issues. TODO: Add robust phone validation in the future.
              />
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
