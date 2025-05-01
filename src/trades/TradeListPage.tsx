import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, TrendingUp, Bitcoin, SortAsc, SortDesc, Edit, Trash2 } from "lucide-react";
import ReasonTooltip from '@/components/ui/ReasonTooltip';
import { fetchTrades, deleteTrade } from './trade-api';
import type { Trade } from './trade-types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TradeEditModal from './TradeEditModal';
import TradeCard from './TradeCard';
import TradeLoadingState from './TradeLoadingState';
import TradeEmptyState from './TradeEmptyState';
import type { Account } from '@/accounts/account-types';
import { fetchAccounts } from '@/accounts/account-api';
import { formatPrice } from "@/lib/utils.ts";

const assetTypeIcons = {
  stock: <TrendingUp className="w-4 h-4 text-blue-500" />,
  crypto: <Bitcoin className="w-4 h-4 text-orange-400" />,
};

const TradeListPage: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Trade | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "stock" | "crypto">("all");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  // Load accounts once on mount
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Map accountId to Account
  const accountMap = useMemo(() => {
    const map: Record<string, Account> = {};
    accounts.forEach(acc => { map[acc.id] = acc; });
    return map;
  }, [accounts]);

  useEffect(() => {
    setLoading(true);
    Promise
      .all([
        fetchTrades().then(res => res),
        fetchAccounts().then(res => res)])
      .then(([trades, accounts]) => {
        setTrades(trades);
        setAccounts(accounts)
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let txs = trades;
    if (filterType !== "all") {
      txs = txs.filter((tx) => tx.assetType === filterType);
    }
    if (search.trim()) {
      txs = txs.filter((tx) => tx.ticker.toLowerCase().includes(search.trim().toLowerCase()));
    }
    txs = [...txs].sort((a, b) =>
      sortDesc
        ? new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime()
        : new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
    );
    return txs;
  }, [trades, filterType, search, sortDesc]);

  const handleTradesChange = (newTxs: Trade[]) => {
    setTrades(newTxs);
    setEditTx(null);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTrade(id);
      const txs = await fetchTrades();
      setTrades(txs);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2"
              variant="primary"
            >
              <Plus className="w-5 h-5" />
              Add Trade
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow overflow-x-auto hidden sm:block">
          {loading ? (
            <TradeLoadingState />
          ) : filtered.length === 0 ? (
            <TradeEmptyState />
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-slate-500 text-xs uppercase">
                  <th className="px-4 py-3 text-center">Trade Date</th>
                  <th className="px-4 py-3 text-center">Type</th>
                  <th className="px-4 py-3 text-center">Asset</th>
                  <th className="px-4 py-3 text-center">Ticker</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">From Account</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 transition border-b last:border-0"
                  >
                    <td className="px-4 py-3 whitespace-nowrap items-center">
                      {new Date(tx.tradeDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex gap-1 items-center">
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
                    <td className="px-4 py-3 items-center">{tx.ticker}</td>
                    <td className="px-4 py-3 text-right">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      {formatPrice(tx.price, tx.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {accountMap[tx.accountId]?.name
                        ? `${accountMap[tx.accountId].name} (${accountMap[tx.accountId].currency})`
                        : 'Unknown Account'}
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <ReasonTooltip reason={tx.reason || ''} />
                      {deletingId === tx.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-500 hover:bg-slate-100"
                            onClick={() => setDeletingId(null)}
                            title="Cancel Delete"
                          >
                            <span className="sr-only">Cancel Delete</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="text-red-600 hover:bg-red-100"
                            onClick={() => handleDelete(tx.id)}
                            title="Confirm Delete"
                          >
                            <span className="sr-only">Confirm Delete</span>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
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
                            onClick={() => setDeletingId(tx.id)}
                            title="Delete"
                            className="text-red-500 hover:bg-red-50"
                            disabled={deletingId === tx.id}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="sm:hidden">
          {loading ? (
            <TradeLoadingState />
          ) : filtered.length === 0 ? (
            <TradeEmptyState />
          ) : (
            <div className="space-y-3">
              {filtered.map((tx) => (
                <TradeCard
                  key={tx.id}
                  tx={tx}
                  accountMap={accountMap}
                  deletingId={deletingId}
                  onEdit={(tx) => { setEditTx(tx); setShowModal(true); }}
                  onDelete={handleDelete}
                  onCancelDelete={() => setDeletingId(null)}
                  onSetDeletingId={setDeletingId}
                />
              ))}
            </div>
          )}
        </div>
        <TradeEditModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditTx(null); }}
          onTradesChange={handleTradesChange}
          trade={editTx || undefined}
          accounts={accounts}
        />
      </div>
    </div>
  );
};

export default TradeListPage;
