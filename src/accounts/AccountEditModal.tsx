import React, { useEffect, useState } from "react";
import { Wallet, DollarSign, Save, Loader2, X } from "lucide-react";
import { Account } from './account-types';
import { createAccount, fetchAccounts, updateAccount } from './account-api';
import Input from '@/components/ui/Input';

const currencyOptions = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "TWD - Taiwanese Dollar", value: "TWD" },
];

interface Props {
  open: boolean;
  accountId?: string | null; // If null or undefined, create mode
  onClose: () => void;
  onUpdated: () => void;
}

export default function AccountEditModal({ open, accountId, onClose, onUpdated }: Props) {
  const isCreate = !accountId;
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});
  const [loading, setLoading] = useState(!isCreate);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setAccount(null);
      setName("");
      setCurrency(currencyOptions[0].value);
      setBalance("");
      setLoading(false);
    } else if (accountId) {
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
    }
  }, [open, accountId, isCreate]);

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
    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      try {
        if (isCreate) {
          await createAccount({
            name: name.trim(),
            currency,
            balance: parseFloat(balance),
          });
        } else if (account) {
          await updateAccount(account.id, {
            name: name.trim(),
            currency,
            balance: parseFloat(balance),
          });
        }
        onUpdated();
        onClose();
      } catch (err) {
        setApiError(isCreate ? "Failed to create account. Please try again." : "Failed to update account. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
          <button
            className="absolute top-5 right-5 text-slate-400 cursor-not-allowed"
            aria-label="Close"
            disabled
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            <span className="text-blue-700 font-semibold text-lg">{isCreate ? "Preparing form..." : "Loading account..."}</span>
          </div>
        </div>
      </div>
    );
  }
  if (!isCreate && !account) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
          <button
            className="absolute top-5 right-5 text-slate-400"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="text-red-600 font-bold text-lg">Account not found.</span>
          </div>
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
            {isCreate ? "Create Account" : "Edit Account"}
          </h2>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <Input
              id="account-name"
              type="text"
              label="Account Name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="off"
              error={errors.name}
              leftIcon={<Wallet className="w-4 h-4 text-blue-400" />}
              disabled={submitting}
              fullWidth
            />
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
            <Input
              id="balance"
              type="number"
              inputMode="decimal"
              step="0.01"
              label={isCreate ? "Initial Balance" : "Balance"}
              value={balance}
              onChange={e => setBalance(e.target.value)}
              error={errors.balance}
              leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
              disabled={submitting}
              fullWidth
            />
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
            {submitting ? (isCreate ? 'Creating...' : 'Saving...') : (isCreate ? 'Create Account' : 'Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
}
