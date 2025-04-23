import React, { useEffect, useState } from "react";
import { Wallet, DollarSign, Save, Loader2, X } from "lucide-react";
import { fetchAccounts, updateAccount } from "../accounts/account-api";
import { Account } from "../accounts/account-types";

const currencyOptions = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "TWD - Taiwanese Dollar", value: "TWD" },
];

interface Props {
  open: boolean;
  accountId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function AccountEditModal({ open, accountId, onClose, onUpdated }: Props) {
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !accountId) return;
    setLoading(true);
    fetchAccounts().then(accs => {
      const found = accs.find(a => a.id === accountId);
      if (found) {
        setAccount(found);
        setName(found.name);
        setCurrency(found.currency);
        setBalance(found.balance.toString());
      }
      setLoading(false);
    });
  }, [open, accountId]);

  if (!open) return null;

  const validate = () => {
    const errs: { name?: string; balance?: string } = {};
    if (!name.trim()) errs.name = "Account name is required.";
    if (!balance || isNaN(Number(balance))) errs.balance = "Balance must be a number.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && account) {
      setSubmitting(true);
      try {
        await updateAccount(account.id, {
          name: name.trim(),
          currency,
          balance: parseFloat(balance),
        });
        onUpdated();
        onClose();
      } catch (err) {
        setApiError("Failed to update account. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500 mb-2" />
          <span className="text-blue-500 font-medium">Loading account...</span>
        </div>
      </div>
    );
  }
  if (!account) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <span className="text-red-600 font-medium text-lg">Account not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        <button
          className="absolute top-5 right-5 text-slate-400 hover:text-red-400 transition"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-extrabold text-blue-900 drop-shadow">
            Edit Account
          </h2>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-slate-700 mb-1">
              Account Name
            </label>
            <div className="relative">
              <input
                id="account-name"
                type="text"
                className={`block w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'account-name-error' : undefined}
                disabled={submitting}
              />
              <Wallet className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
            </div>
            {errors.name && (
              <p id="account-name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              className="block w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-300"
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
            <label htmlFor="balance" className="block text-sm font-medium text-slate-700 mb-1">
              Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                id="balance"
                type="number"
                inputMode="decimal"
                step="0.01"
                className={`pl-10 block w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.balance ? 'border-red-500' : 'border-slate-300'}`}
                value={balance}
                onChange={e => setBalance(e.target.value)}
                aria-invalid={!!errors.balance}
                aria-describedby={errors.balance ? 'balance-error' : undefined}
                disabled={submitting}
              />
            </div>
            {errors.balance && (
              <p id="balance-error" className="mt-1 text-xs text-red-600">{errors.balance}</p>
            )}
          </div>
          {apiError && (
            <div className="text-red-600 font-semibold text-center animate-pulse">{apiError}</div>
          )}
          <button
            type="submit"
            className={`mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={submitting}
          >
            <Save className="w-5 h-5" />
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
