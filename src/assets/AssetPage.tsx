import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, TrendingUp, Bitcoin, LineChart, Wallet } from 'lucide-react';
import Button from '../components/ui/Button';
import StockTransactionModal from '../transactions/StockTransactionModal';
import AccountSummaryList from './AccountSummaryList';
import AssetAccountSummaryTable from './AssetAccountSummaryTable';
import { fetchTransactions } from '../transactions/transaction-api';
import { fetchAccounts } from '../accounts/account-api';
import type { Transaction } from '../transactions/transaction-types';
import type { Account } from '../accounts/account-types';

const AssetPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssetForTx, setSelectedAssetForTx] = useState<null | { ticker: string; type: string }>(null);
  const [transactions, setTxs] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions and accounts from API on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [txs, accs] = await Promise.all([
          fetchTransactions(),
          fetchAccounts()
        ]);
        setTxs(txs);
        setAssets(buildAssetsFromTransactions(txs));
        setAccounts(accs);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper to rebuild asset list from transactions
  const buildAssetsFromTransactions = useCallback((txs: Transaction[]) => {
    const assetMap: Record<string, { ticker: string; name: string; type: string; quantity: number; price: number; icon: JSX.Element }> = {};
    txs.forEach(tx => {
      if (!assetMap[tx.ticker]) {
        assetMap[tx.ticker] = {
          ticker: tx.ticker,
          name: tx.ticker,
          type: tx.assetType,
          quantity: 0,
          price: 0,
          icon: tx.assetType === 'crypto' ? <Bitcoin className="w-6 h-6 text-yellow-500" /> : <TrendingUp className="w-6 h-6 text-blue-600" />,
        };
      }
      assetMap[tx.ticker].quantity += tx.type === 'buy' ? tx.quantity : -tx.quantity;
      assetMap[tx.ticker].price = tx.price; // last price
    });

    return Object.values(assetMap);
  }, []);

  // Handler for transaction changes
  const handleTransactionsChange = async (_newTxs: Transaction[]) => {
    // Always re-fetch from API for consistency
    const txs = await fetchTransactions();
    setTxs(txs);
    setAssets(buildAssetsFromTransactions(txs));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-700 animate-pulse text-xl font-semibold">Loading assets...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    );
  }
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LineChart className="w-12 h-12 text-blue-400 mb-4" />
        <div className="text-slate-600 text-lg mb-2">No transactions found.</div>
        <Button onClick={() => setModalOpen(true)} className="mt-2">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Transaction
        </Button>
        <StockTransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onTransactionsChange={handleTransactionsChange}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 drop-shadow-lg flex items-center gap-3">
            <LineChart className="w-8 h-8 text-blue-700" /> Asset Portfolio
          </h1>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 shadow-xl"
              onClick={() => setModalOpen(true)}
            >
              <PlusCircle className="w-5 h-5" /> Add Transaction
            </Button>
          </div>
        </div>
        {/* Accounts summary section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-500" /> Accounts
          </h2>
          <AccountSummaryList />
        </section>
        {/* Assets grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" /> Assets
          </h2>
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-8 relative">
              {assets.map((asset: { ticker: string; name: string; type: string; quantity: number; price: number; icon: JSX.Element }) => {
                const isZero = asset.quantity === 0;
                return (
                  <div
                    key={asset.ticker}
                    className={`bg-white/90 rounded-3xl shadow-2xl px-8 py-7 flex flex-col gap-5 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80 ${isZero ? 'opacity-60 grayscale hover:opacity-90 hover:grayscale-0' : ''}`}
                    onClick={() => setSelectedAssetForTx({ ticker: asset.ticker, type: asset.type })}
                    title={`Add transaction for ${asset.ticker}`}
                  >
                    {isZero && (
                      <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full shadow">No holdings</span>
                    )}
                    <div className="flex items-center gap-5 mb-2">
                      <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
                        {asset.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
                          {asset.ticker}
                          <span className="text-base font-medium text-gray-500">({asset.name})</span>
                        </div>
                        <div className="text-sm text-blue-500 mt-1 font-semibold uppercase tracking-wider">{asset.type}</div>
                      </div>
                    </div>
                    <div className="flex gap-10 items-end">
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-700 font-semibold">Quantity</span>
                        <span className="text-2xl font-bold text-blue-700 tabular-nums">{asset.quantity}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-700 font-semibold">Price</span>
                        <span className="text-2xl font-bold text-green-600 tabular-nums">${asset.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-700 font-semibold">Value</span>
                        <span className="text-2xl font-bold text-blue-900 tabular-nums">${(asset.price * asset.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold">Gain/Loss:</span>
                        <span className="text-green-600 font-bold">+0.00%</span> {/* Placeholder */}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Last updated:</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <StockTransactionModal
          open={modalOpen || !!selectedAssetForTx}
          onClose={() => {
            setModalOpen(false);
            setSelectedAssetForTx(null);
          }}
          onTransactionsChange={handleTransactionsChange}
          ticker={selectedAssetForTx?.ticker}
          assetType={selectedAssetForTx?.type}
        />
        {/* Asset & Account Summary Table */}
        <AssetAccountSummaryTable accounts={accounts} assets={assets} />
      </div>
    </div>
  );
};

export default AssetPage;
