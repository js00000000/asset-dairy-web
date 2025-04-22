import React, { useState } from "react";
import { PlusCircle, Wallet, DollarSign, X } from "lucide-react";
import { createAccount } from "../services/api";
import { useAuthStore } from "../modules/auth/auth-store";

const currencyOptions = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "CNY - Chinese Yuan", value: "CNY" },
  { label: "GBP - British Pound", value: "GBP" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AccountCreateModal({ open, onClose, onCreated }: Props) {
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!open) return null;

  const validate = () => {
    const errs: { name?: string; balance?: string } = {};
    if (!name.trim()) errs.name = "Account name is required.";
    if (!balance || isNaN(Number(balance))) errs.balance = "Initial balance must be a number.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      try {
        await createAccount({
          name: name.trim(),
          currency,
          balance: parseFloat(balance),
          ownerId: user?.id || "", // Pass ownerId along with name, currency, balance
        });
        setName("");
        setBalance("");
        setCurrency(currencyOptions[0].value);
        onCreated();
        onClose();
      } catch (err) {
        setApiError("Failed to create account. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 relative">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Account Name
            </label>
            <input
              id="account-name"
              type="text"
              className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white ${errors.name ? "border-red-500" : "border-slate-300"}`}
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="off"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "account-name-error" : undefined}
              disabled={submitting}
            />
            {errors.name && (
              <p id="account-name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Currency
            </label>
            <select
              id="currency"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              disabled={submitting}
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                id="balance"
                type="number"
                inputMode="decimal"
                step="0.01"
                className={`pl-9 mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white ${errors.balance ? "border-red-500" : "border-slate-300"}`}
                value={balance}
                onChange={e => setBalance(e.target.value)}
                aria-invalid={!!errors.balance}
                aria-describedby={errors.balance ? "balance-error" : undefined}
                disabled={submitting}
              />
            </div>
            {errors.balance && (
              <p id="balance-error" className="mt-1 text-xs text-red-600">{errors.balance}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={submitting}
          >
            <PlusCircle className="w-5 h-5" />
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
          {apiError && (
            <div className="text-red-600 text-center font-medium mt-2">{apiError}</div>
          )}
        </form>
      </div>
    </div>
  );
}
