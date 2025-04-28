import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, LineChart, Wallet } from 'lucide-react';
import AssetCard from './AssetCard';
import Button from '../components/ui/Button';
import TradeEditModal from '../trades/TradeEditModal';
import AccountSummaryList from './AccountSummaryList';
import AssetAccountSummaryTable from './AssetAccountSummaryTable';
import AccountEditModal from '../accounts/AccountEditModal';
import { fetchTrades } from '../trades/trade-api';
import type { Trade } from '../trades/trade-types';
import { fetchAccounts } from '../accounts/account-api';
import type { Account } from '../accounts/account-types';
import { getCryptoPrice, getStockPrice } from './portfolio-api';

const PortfolioPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedAssetForTx, setSelectedAssetForTx] = useState<null | { ticker: string; type: string }>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load trades and accounts from API on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [txs, accs] = await Promise.all([
          fetchTrades(),
          fetchAccounts()
        ]);
        setAssets(await buildAssetsFromTrades(txs));
        setAccounts(accs);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper to rebuild asset list from trades
  const buildAssetsFromTrades = async (txs: Trade[]) => {
    // Enhanced asset map to include averagePrice
    const assetMap: Record<string, {
      ticker: string;
      name: string;
      type: string;
      quantity: number;
      price: number | null;
      averagePrice: number;
    }> = {};
    // For average price calculation
    const buyData: Record<string, { totalCost: number; totalQty: number }> = {};

    txs.forEach(tx => {
      if (!assetMap[tx.ticker]) {
        assetMap[tx.ticker] = {
          ticker: tx.ticker,
          name: tx.ticker,
          type: tx.assetType,
          quantity: 0,
          price: 0,
          averagePrice: 0,
        };
        buyData[tx.ticker] = { totalCost: 0, totalQty: 0 };
      }
      // Update quantity and last price
      assetMap[tx.ticker].quantity += tx.type === 'buy' ? tx.quantity : -tx.quantity;
      // For average price: only consider buys
      if (tx.type === 'buy') {
        buyData[tx.ticker].totalCost += tx.price * tx.quantity;
        buyData[tx.ticker].totalQty += tx.quantity;
      } else if (tx.type === 'sell') {
        // For weighted average, reduce totalQty by sold amount
        // Remove cost basis proportionally (FIFO/LIFO not considered, just weighted avg)
        const sellQty = tx.quantity;
        if (buyData[tx.ticker].totalQty > 0) {
          const avg = buyData[tx.ticker].totalCost / buyData[tx.ticker].totalQty;
          buyData[tx.ticker].totalCost -= avg * sellQty;
          buyData[tx.ticker].totalQty -= sellQty;
          if (buyData[tx.ticker].totalQty < 0) buyData[tx.ticker].totalQty = 0;
          if (buyData[tx.ticker].totalCost < 0) buyData[tx.ticker].totalCost = 0;
        }
      }
    });

    // remove asset in assetMap which quantity is 0
    Object.keys(assetMap).forEach(ticker => {
      if (assetMap[ticker].quantity === 0) {
        delete assetMap[ticker];
      }
    });

    // Set averagePrice for each asset
    const assetEntries = Object.entries(assetMap);
    await Promise.all(assetEntries.map(async ([ticker, asset]) => {
      const { totalCost, totalQty } = buyData[ticker];
      asset.price = asset.type === 'stock'
        ? await getStockPrice(ticker)
        : await getCryptoPrice(ticker);
      asset.averagePrice = totalQty > 0 ? totalCost / totalQty : 0;
    }));

    return Object.values(assetMap);
  };

  // Callback to reload accounts and trades after edit
  const handleAccountsUpdated = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txs, accs] = await Promise.all([
        fetchTrades(),
        fetchAccounts()
      ]);
      setAssets(await buildAssetsFromTrades(txs));
      setAccounts(accs);
    } catch (err: any) {
      setError(err.message || 'Failed to reload data');
    } finally {
      setLoading(false);
    }
  };

  // Handler for trade changes
  const handleTradesChange = async (_newTxs: Trade[]) => {
    // Always re-fetch from API for consistency
    const txs = await fetchTrades();
    setAssets(await buildAssetsFromTrades(txs));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-700 animate-pulse text-xl font-semibold">Loading portfolio...</div>
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Accounts summary section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-500" /> Accounts
            </h2>
            <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50"
            onClick={() => setAccountModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" /> Add Account
          </Button>
          </div>
          {accounts.length === 0 && (
            <div className="flex items-center gap-2 text-slate-400 italic mb-3">
              <Wallet className="w-4 h-4" /> No account
            </div>
          )}
          {accounts.length > 0 && (
            <AccountSummaryList accounts={accounts} onUpdated={handleAccountsUpdated} />
          )}
          <AccountEditModal
            open={accountModalOpen}
            onClose={() => setAccountModalOpen(false)}
            onUpdated={handleAccountsUpdated}
          />
        </section>
        {/* Portfolio grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" /> Portfolio
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50"
              onClick={() => setModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" /> Add Trade
            </Button>
          </div>
          {assets.length === 0 && (
            <div className="flex items-center gap-2 text-slate-400 italic mb-3">
              <LineChart className="w-4 h-4" /> No trade
            </div>
          )}
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-8 relative">
              {assets.length > 0 && assets.map((asset: {
                ticker: string;
                name: string;
                type: string;
                quantity: number;
                price: number;
                averagePrice: number
              }) => (
                <AssetCard
                  key={asset.ticker}
                  ticker={asset.ticker}
                  type={asset.type}
                  quantity={asset.quantity}
                  price={asset.price}
                  averagePrice={asset.averagePrice}
                  isZero={asset.quantity === 0}
                  onClick={() => setSelectedAssetForTx({ ticker: asset.ticker, type: asset.type })}
                />
              ))}
            </div>
          </div>
        </section>
        <TradeEditModal
          open={modalOpen || !!selectedAssetForTx}
          onClose={() => {
            setModalOpen(false);
            setSelectedAssetForTx(null);
          }}
          onTradesChange={handleTradesChange}
          ticker={selectedAssetForTx?.ticker}
          assetType={selectedAssetForTx?.type === 'stock' || selectedAssetForTx?.type === 'crypto' ? selectedAssetForTx.type : undefined}
        />
      </div>
      {/* Asset & Account Summary Table */}
      <AssetAccountSummaryTable accounts={accounts} assets={assets} />
    </div>
  );
};

export default PortfolioPage;
