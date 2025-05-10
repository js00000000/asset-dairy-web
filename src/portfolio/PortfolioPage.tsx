import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, LineChart, Wallet } from 'lucide-react';
import AssetCard from './AssetCard';
import Button from '@/components/ui/Button';
import TradeEditModal from '@/trades/TradeEditModal';
import AccountSummaryList from './AccountSummaryList';
import AssetAccountSummaryTable from './AssetAccountSummaryTable';
import AccountEditModal from '@/accounts/AccountEditModal';
import type { Trade } from '@/trades/trade-types';
import { AccountApi } from '@/accounts/account-api';
import type { Account } from '@/accounts/account-types';
import { getCryptoPrice, getStockPrice } from '@/lib/realTimePrice-api';
import { HoldingApi } from '@/holdings/holding-api';
import type { Holding } from '@/holdings/holding-types';

const PortfolioPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedAssetForTx, setSelectedAssetForTx] = useState<null | { ticker: string; type: string }>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load trades and accounts from API on mount
  useEffect(() => {
    setHoldingsLoading(true);
    setAccountsLoading(true);
    setError(null);

    loadHoldings()
      .then(holdings => {
        setHoldings(holdings);
      })
      .catch(err => {
        console.error('Failed to load holdings:', err);
        setError(err.message || 'Failed to load holdings');
      })
      .finally(() => setHoldingsLoading(false));

    AccountApi.fetchAccounts()
      .then(accounts => {
        setAccounts(accounts);
      })
      .catch(err => {
        console.error('Failed to load accounts:', err);
        setError(err.message || 'Failed to load accounts');
      })
      .finally(() => setAccountsLoading(false));
  }, []);

  // Helper to load holdings with current prices
  const loadHoldings = async () => {
    try {
      // Fetch holdings from API
      const holdings = await HoldingApi.fetchHoldings();

      // Get current prices for each holding
      const holdingsWithPrices = await Promise.all(holdings.map(async (holding) => ({
        ...holding,
        price: holding.assetType === 'stock'
          ? await getStockPrice(holding.ticker)
          : await getCryptoPrice(holding.ticker)
      })));

      return holdingsWithPrices;
    } catch (err: any) {
      console.error('Failed to fetch holdings:', err);
      throw new Error('Failed to load holdings');
    }
  };

  const handleAccountsUpdated = async () => {
    setAccountsLoading(true);
    setError(null);
    try {
      setAccounts(await AccountApi.fetchAccounts());
    } catch (err: any) {
      setError(err.message || 'Failed to reload accounts');
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleTradesChange = async (_newTxs: Trade[]) => {
    setHoldingsLoading(true);
    setError(null);
    try {
      setHoldings(await loadHoldings());
    } catch (err: any) {
      setError(err.message || 'Failed to reload holdings');
    } finally {
      setHoldingsLoading(false);
    }
  };

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
          {accountsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-blue-700 animate-pulse text-md font-semibold">Loading accounts...</div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex items-center gap-2 text-slate-400 italic mb-3">
              <Wallet className="w-4 h-4" /> No account
            </div>
          ) : (
            <AccountSummaryList
              accounts={accounts}
              onUpdated={handleAccountsUpdated}
              onEdit={(accountId) => {
                setSelectedAccountId(accountId);
                setAccountModalOpen(true);
              }}
            />
          )}
          <AccountEditModal
            open={accountModalOpen}
            accountId={selectedAccountId}
            onClose={() => {
              setAccountModalOpen(false);
              setSelectedAccountId(null);
            }}
            onUpdated={handleAccountsUpdated}
            accounts={accounts}
          />
        </section>
        {/* Holdings grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" /> Holdings
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
          {holdingsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-blue-700 animate-pulse text-md font-semibold">Loading holdings...</div>
            </div>
          ) : holdings.length === 0 ? (
            <div className="flex items-center gap-2 text-slate-400 italic mb-3">
              <LineChart className="w-4 h-4" /> No holdings
            </div>
          ) : (
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 relative">
                {holdings.map((holding) => (
                  <AssetCard
                    key={holding.ticker}
                    ticker={holding.ticker}
                    type={holding.assetType}
                    quantity={holding.quantity}
                    price={holding.price!}
                    currency={holding.currency}
                    averagePrice={holding.averagePrice}
                    isZero={holding.quantity === 0}
                    onClick={() => setSelectedAssetForTx({ ticker: holding.ticker, type: holding.assetType })}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
        <TradeEditModal
          open={modalOpen || !!selectedAssetForTx}
          onClose={() => {
            setModalOpen(false);
            setSelectedAssetForTx(null);
          }}
          onTradesChange={handleTradesChange}
          accounts={accounts}
          ticker={selectedAssetForTx?.ticker}
          assetType={selectedAssetForTx?.type === 'stock' || selectedAssetForTx?.type === 'crypto'
            ? selectedAssetForTx.type
            : undefined}
        />
      </div>
      {/* Asset & Account Summary Table */}
      {!accountsLoading && !holdingsLoading && (
        <AssetAccountSummaryTable accounts={accounts} holdings={holdings} />
      )}
    </div>
  );
};

export default PortfolioPage;
