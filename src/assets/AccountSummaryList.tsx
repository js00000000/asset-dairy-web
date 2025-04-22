import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { fetchAccounts } from "../accounts/account-api";
import type { Account } from "../accounts/account-types";
import AccountEditModal from "../accounts/AccountEditModal";

const currencySymbols: Record<string, string> = {
  USD: "$",
  TWD: "NT$",
};

export default function AccountSummaryList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAccounts = () => {
    setLoading(true);
    fetchAccounts()
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load accounts");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="text-blue-600 animate-pulse p-4">Loading accounts...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!accounts.length) return <div className="text-slate-500 p-4">No accounts found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white/90 rounded-2xl shadow-xl px-6 py-5 flex items-center gap-5 border border-blue-100 hover:shadow-blue-200/60 transition group cursor-pointer"
            onClick={() => {
              setEditId(account.id);
              setModalOpen(true);
            }}
            title="Edit account"
          >
            <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
              <Wallet className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-lg font-bold text-blue-900 drop-shadow-sm">{account.name}</span>
              <span className="text-sm text-gray-500 uppercase tracking-wide">{account.currency}</span>
            </div>
            <div className="text-xl font-extrabold text-green-700 tabular-nums">
              {currencySymbols[account.currency] || account.currency + " "}
              {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
      <AccountEditModal
        open={modalOpen}
        accountId={editId}
        onClose={() => {
          setModalOpen(false);
          setEditId(null);
        }}
        onUpdated={loadAccounts}
      />
    </>
  );
}
