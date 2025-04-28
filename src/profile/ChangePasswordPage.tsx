import React, { useState } from "react";
import { useAuthStore } from '@/auth/auth-store';
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Save, ArrowLeft } from "lucide-react";
import Input from '@/components/ui/Input';

const ChangePasswordPage: React.FC = () => {
  const { changePassword, isLoading, error } = useAuthStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!current || !next || !confirm) {
      setFormError("All fields are required.");
      return false;
    }
    if (next.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':\",.<>/?]{8,}$/.test(next)) {
      setFormError("Password must include at least one letter and one number.");
      return false;
    }
    if (next !== confirm) {
      setFormError("Passwords do not match.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await changePassword(current, next);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 1000);
    } catch (err) {
      // error state handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative">
        <Link
          to="/profile"
          className="absolute left-6 top-6 flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-3">
          <Input
            type={showCurrent ? "text" : "password"}
            label="Current Password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
            leftIcon={<Lock className="w-4 h-4 text-blue-400" />}
            rightIcon={showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            rightIconOnClick={() => setShowCurrent(s => !s)}
            fullWidth
          />
          <Input
            type={showNext ? "text" : "password"}
            label="New Password"
            value={next}
            onChange={e => setNext(e.target.value)}
            autoComplete="new-password"
            required
            leftIcon={<Lock className="w-4 h-4 text-blue-400" />}
            rightIcon={showNext ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            rightIconOnClick={() => setShowNext(s => !s)}
            fullWidth
          />
          <Input
            type={showConfirm ? "text" : "password"}
            label="Confirm New Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            leftIcon={<Lock className="w-4 h-4 text-blue-400" />}
            rightIcon={showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            rightIconOnClick={() => setShowConfirm(s => !s)}
            fullWidth
          />
          {formError && (
            <div className="text-red-600 font-semibold text-center mt-2 animate-pulse">
              {formError}
            </div>
          )}
          {error && (
            <div className="text-red-600 font-semibold text-center mt-2 animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 font-semibold text-center mt-2 animate-pulse">
              Password changed successfully!
            </div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            disabled={isLoading}
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
