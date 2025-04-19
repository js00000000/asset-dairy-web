import React, { useEffect, useState } from "react";
import { Wallet, PlusCircle, Loader2, AlertCircle, Pencil, Trash2, X, Check } from "lucide-react";
import { fetchAccounts, deleteAccount } from "../services/api";
import { Account } from "../types/account";
import { AccountCreateModal, AccountEditModal } from "../components/account";


export default function AccountListPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const loadAccounts = () => {
    setLoading(true);
    setError(false);
    fetchAccounts()
      .then(data => {
        setAccounts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(deleteId);
      setDeleteId(null);
      loadAccounts();
    } catch {
      setDeleteError("Failed to delete account. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const isEmpty = !loading && !error && accounts.length === 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-2 sm:px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 sm:p-8 border border-slate-200 dark:border-slate-700 mt-6 mb-6 sm:mt-12 sm:mb-12">

          <div className="flex flex-row items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Wallet className="text-blue-600 dark:text-blue-400 w-7 h-7 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Accounts</h1>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="ml-auto flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden xs:inline">Create Account</span>
            </button>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
              <span className="ml-3 text-blue-500 font-medium">Loading accounts...</span>
            </div>
          )}
          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-12 text-red-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>Failed to load accounts. Please try again.</span>
            </div>
          )}
          {/* Empty State */}
          {isEmpty && (
            <div className="flex flex-col items-center py-12">
              <Wallet className="w-10 h-10 text-slate-400 mb-2" />
              <span className="text-slate-500">No accounts found. Start by creating one!</span>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-4 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Create Account
              </button>
            </div>
          )}
          {/* Accounts List */}
          {!loading && !error && !isEmpty && (
            <>
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {accounts.map((account) => (
                  <li
                    key={account.id}
                    className="flex flex-row items-center py-4 xs:py-5 group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors gap-2 xs:gap-0"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="text-base xs:text-lg font-semibold text-slate-900 dark:text-white truncate">{account.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{account.currency}</div>
                    </div>
                    <div className="text-lg xs:text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums xs:ml-4 mr-2 xs:mr-4">
                      {account.currency === "USD" ? "$" : account.currency + " "}
                      {account.balance}
                    </div>
                    {/* Actions: always on the right */}
                    <div className="flex gap-2 items-center ml-auto">
                      <button
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Edit account"
                        onClick={() => setEditId(account.id)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-slate-400 hover:text-red-500"
                        title="Delete account"
                        onClick={() => setDeleteId(account.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Delete Confirmation Modal */}
              {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 w-full max-w-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Trash2 className="w-6 h-6 text-red-500" />
                      <span className="font-bold text-lg text-slate-900 dark:text-white">Delete Account</span>
                    </div>
                    <div className="mb-6 text-slate-700 dark:text-slate-300">
                      Are you sure you want to delete this account? This action cannot be undone.
                    </div>
                    {deleteError && <div className="text-red-600 mb-2">{deleteError}</div>}
                    <div className="flex gap-3 justify-end">
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
                        onClick={() => setDeleteId(null)}
                        disabled={deleting}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 shadow"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        <Check className="w-4 h-4" />
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <AccountCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadAccounts}
        />
        <AccountEditModal
          open={!!editId}
          accountId={editId}
          onClose={() => setEditId(null)}
          onUpdated={loadAccounts}
        />
      </div>
  );
}

