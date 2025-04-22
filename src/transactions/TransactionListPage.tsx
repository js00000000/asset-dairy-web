import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, TrendingUp, Bitcoin, Loader2, SortAsc, SortDesc, Edit, Trash2 } from "lucide-react";
import { fetchTransactions, deleteTransaction } from "./transaction-api";
import type { Transaction } from "./transaction-types";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StockTransactionModal from "./StockTransactionModal";
import { loadAccounts } from "../lib/storage-helpers";
import type { Account } from "../accounts/account-types";

// Extend StockTransactionModal with edit capability via props
// (Assume modal handles initialValues and edit mode if transaction prop is passed)


const assetTypeIcons = {
  stock: <TrendingUp className="w-4 h-4 text-blue-500" />,
  crypto: <Bitcoin className="w-4 h-4 text-orange-400" />,
};

const TransactionListPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "stock" | "crypto">("all");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  // Load accounts once on mount
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    setAccounts(loadAccounts());
  }, []);

  // Map accountId to Account
  const accountMap = useMemo(() => {
    const map: Record<string, Account> = {};
    accounts.forEach(acc => { map[acc.id] = acc; });
    return map;
  }, [accounts]);

  useEffect(() => {
    setLoading(true);
    fetchTransactions()
      .then((txs) => setTransactions(txs))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let txs = transactions;
    if (filterType !== "all") {
      txs = txs.filter((tx) => tx.assetType === filterType);
    }
    if (search.trim()) {
      txs = txs.filter((tx) => tx.ticker.toLowerCase().includes(search.trim().toLowerCase()));
    }
    txs = [...txs].sort((a, b) =>
      sortDesc
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return txs;
  }, [transactions, filterType, search, sortDesc]);

  const handleTransactionsChange = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    setEditTx(null);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      const txs = await fetchTransactions();
      setTransactions(txs);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            Transactions
            <span className="text-base font-medium text-slate-400">overview</span>
          </h1>
          <p className="text-slate-500">
            View, search, and add your asset transactions.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
          variant="primary"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterType("all")}
            variant={filterType === "all" ? "secondary" : "ghost"}
            className="flex items-center gap-1"
          >
            All
          </Button>
          <Button
            onClick={() => setFilterType("stock")}
            variant={filterType === "stock" ? "secondary" : "ghost"}
            className="flex items-center gap-1"
          >
            <TrendingUp className="w-4 h-4" />
            Stock
          </Button>
          <Button
            onClick={() => setFilterType("crypto")}
            variant={filterType === "crypto" ? "secondary" : "ghost"}
            className="flex items-center gap-1"
          >
            <Bitcoin className="w-4 h-4" />
            Crypto
          </Button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticker (e.g. AAPL, BTC)"
            className="w-48"
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
          <Button
            variant="ghost"
            onClick={() => setSortDesc((v) => !v)}
            title={sortDesc ? "Sort by date (desc)" : "Sort by date (asc)"}
          >
            <span className="sr-only">Sort</span>
            {sortDesc ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-3 text-slate-500">Loading transactions...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span>No transactions found.</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Asset</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-left">Account</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 transition border-b last:border-0"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <span
                      className={
                        tx.type === "buy"
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      {assetTypeIcons[tx.assetType]}
                      <span className="capitalize">{tx.assetType}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">{tx.ticker}</td>
                  <td className="px-4 py-3 text-right">{tx.quantity}</td>
                  <td className="px-4 py-3 text-right">${tx.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-left">
                    {accountMap[tx.accountId]?.name
                      ? `${accountMap[tx.accountId].name} (${accountMap[tx.accountId].currency})`
                      : 'Unknown Account'}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditTx(tx); setShowModal(true); }}
                      title="Edit"
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <span className="sr-only">Edit</span>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDeleteId(tx.id)}
                      title="Delete"
                      className="text-red-500 hover:bg-red-50"
                      disabled={deletingId === tx.id}
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {confirmDeleteId === tx.id && (
                      <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1 flex gap-2 items-center">
                        <span>Delete?</span>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <StockTransactionModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditTx(null); }}
        onTransactionsChange={handleTransactionsChange}
        transaction={editTx || undefined}
      />
    </div>
  );
};

export default TransactionListPage;
