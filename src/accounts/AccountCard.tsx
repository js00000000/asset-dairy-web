import React, { useState } from "react";
import { Wallet, Trash2 } from "lucide-react";
import type { Account } from './account-types';
import { AccountApi } from './account-api';
import { useToast } from '@/lib/toast';
import Button from '@/components/ui/Button';

export interface AccountCardProps {
  account: Account;
  onClick?: () => void;
  onDelete?: (accountId: string) => void;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  TWD: "NT$",
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
    setError(null);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    setError(null);
    try {
      await AccountApi.deleteAccount(account.id);
      toast.success('Account deleted successfully');
      setShowConfirm(false);
      if (onDelete) onDelete(account.id);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="bg-white/90 rounded-3xl shadow-2xl px-6 py-6 flex flex-col gap-6 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80"
      onClick={onClick}
      title={`Edit account: ${account.name}`}
    >
      {/* Delete Icon - visually separated, floating, with better spacing and hover */}
      {!showConfirm && (
        <button
          className="absolute -top-3 -right-3 z-20 p-2 bg-white border border-red-100 shadow-md rounded-full hover:bg-red-100 transition-colors group/delete"
          title="Delete account"
          onClick={handleDeleteClick}
          tabIndex={0}
          aria-label="Delete account"
          style={{ boxShadow: '0 2px 8px 0 rgba(255,0,0,0.08)' }}
        >
          <Trash2 className="w-5 h-5 text-red-400 group-hover/delete:text-red-600 transition-colors" />
        </button>
      )}

      {/* Header: Icon, Account Name, Currency, Balance */}
      <div className="flex items-center justify-between mb-1 w-full relative">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
              {account.name}
            </span>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-0.5">
              {account.currency}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[90px] pr-1">
          <span className="text-xs text-gray-500 font-medium">Balance</span>
          <span className="text-2xl font-bold text-green-600 tabular-nums">
            {currencySymbols[account.currency] || account.currency + " "}
            {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-lg rounded-3xl flex flex-col items-center justify-center z-20 gap-3 border-2 border-red-200 shadow-xl">
          <span className="text-red-700 font-semibold text-lg mb-1">Delete this account?</span>
          {error && <span className="text-xs text-red-500 mb-1">{error}</span>}
          <div className="flex gap-3">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </Button>
            <Button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded-xl shadow"
              onClick={handleCancel}
              disabled={deleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountCard;
