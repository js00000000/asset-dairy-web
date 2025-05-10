import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, ArrowDownCircle, ArrowUpCircle, Bitcoin, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Info } from 'lucide-react';
import type { Trade } from './trade-types';
import type { Account } from '@/accounts/account-types';
import { getStockPrice, getCryptoPrice } from '@/lib/realTimePrice-api';
import { useToast } from '@/lib/toast';
import { formatPrice } from '@/lib/utils';
import { useTradeStore } from './trade-store';

interface TradeEditModalProps {
  open: boolean;
  onClose: () => void;
  onTradesChange?: () => void;
  trade?: Trade;
  ticker?: string;
  assetType?: 'stock' | 'crypto';
  accounts: Account[];
}

const TradeEditModal: React.FC<TradeEditModalProps> = ({ open, onClose, onTradesChange, trade, ticker: initialTicker, assetType: initialAssetType, accounts }: TradeEditModalProps) => {
  const [type, setType] = useState<'buy' | 'sell'>(trade ? trade.type : 'buy');
  const [assetType, setAssetType] = useState<'stock' | 'crypto'>(trade ? trade.assetType : (initialAssetType || 'stock'));
  const [ticker, setTicker] = useState(trade ? trade.ticker : (initialTicker || ''));
  const [quantity, setQuantity] = useState(trade ? String(trade.quantity) : '');
  const [price, setPrice] = useState(trade ? String(trade.price) : '');
  const [accountId, setAccountId] = useState(trade ? trade.accountId : '');
  const [reason, setReason] = useState(trade ? trade.reason || '' : '');
  const [tradeDate, setTradeDate] = useState(trade ? trade.tradeDate.split('T')[0] : '');
  const [currency, setCurrency] = useState<'USD' | 'TWD'>(trade ? trade.currency : 'USD');
  const [isValidatingTicker, setIsValidatingTicker] = useState(false);
  const [isTickerValid, setIsTickerValid] = useState(false);
  const { createTrade, updateTrade, isLoading } = useTradeStore();

  useEffect(() => {
    // If creating (no trade) and no accountId, set to first account
    if (!trade && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [open, accounts, trade, accountId]);

  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Reset fields when modal opens/closes or trade changes
  useEffect(() => {
    if (open) {
      setType(trade ? trade.type : 'buy');
      setAssetType(trade ? trade.assetType : (initialAssetType || 'stock'));
      setTicker(trade ? trade.ticker : (initialTicker || ''));
      setReason(trade ? trade.reason || '' : '');
      setQuantity(trade ? String(trade.quantity) : '');
      setPrice(trade ? String(trade.price) : '');
      setCurrency(trade ? trade.currency : 'USD');
      // If creating (no trade), default to first account if available
      if (trade) {
        setAccountId(trade.accountId);
      } else if (accounts.length > 0) {
        setAccountId(accounts[0].id);
      } else {
        setAccountId('');
      }
      setTradeDate(trade ? trade.tradeDate.split('T')[0] : (() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      })());
      setError(null);
    }
  }, [open, trade, accounts, initialTicker, initialAssetType]);

  const validateTicker = async (newTicker: string) => {
    if (!newTicker.trim()) {
      setError(null);
      return;
    }

    setIsValidatingTicker(true);
    setIsTickerValid(false);
    setError(null);

    try {
      const price = assetType === 'stock'
        ? await getStockPrice(newTicker)
        : await getCryptoPrice(newTicker);

      if (price === null) {
        setError(`Invalid ${assetType} ticker symbol`);
      } else {
        setPrice(String(price));
        setIsTickerValid(true);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to validate ${assetType} ticker`);
    } finally {
      setIsValidatingTicker(false);
    }
  };

  // Validate ticker when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateTicker(ticker);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [ticker, assetType]);

  if (!open) return null;

  const validate = () => {
    if (!ticker.trim() || !quantity || !price || !accountId || !tradeDate) {
      setError('All fields are required.');
      return false;
    }
    if (isValidatingTicker) {
      setError('Please wait for ticker validation to complete.');
      return false;
    }
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Quantity must be a positive number.');
      return false;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a positive number.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (trade) {
        // Edit mode
        const updatedTx = {
          ...trade,
          assetType,
          type,
          tradeDate,
          quantity: Number(quantity),
          price: Number(price),
          accountId,
          ticker,
          reason,
          currency,
        };
        await updateTrade(trade.id, updatedTx);
        onTradesChange?.();
        toast.success('Trade updated successfully');
        onClose();
      } else {
        // Add mode
        const tx = {
          assetType,
          type,
          tradeDate,
          quantity: Number(quantity),
          price: Number(price),
          accountId,
          ticker,
          reason,
          currency,
        };
        await createTrade(tx);
        onTradesChange?.();
        toast.success('Trade added successfully');
        onClose();
      }
    } catch (err) {
      toast.error('Failed to save trade');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative overflow-hidden">
        <button
          className="absolute top-5 right-5 text-slate-400 hover:text-red-400 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          {type === 'buy' ? (
            <ArrowUpCircle className="w-7 h-7 text-green-500" />
          ) : (
            <ArrowDownCircle className="w-7 h-7 text-red-500" />
          )}
          <h2 className="text-2xl font-extrabold text-blue-900 drop-shadow">
            {trade ? 'Edit' : type === 'buy' ? 'Record Buy' : 'Record Sell'} Trade
          </h2>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border transition font-semibold ${type === 'buy' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-600'}`}
              onClick={() => setType('buy')}
            >
              <ArrowUpCircle className="w-5 h-5" /> Buy
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border transition font-semibold ${type === 'sell' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-600'}`}
              onClick={() => setType('sell')}
            >
              <ArrowDownCircle className="w-5 h-5" /> Sell
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border transition font-semibold ${assetType === 'stock' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-600'}`}
              onClick={() => setAssetType('stock')}
            >
              <TrendingUp className="w-5 h-5" /> Stock
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border transition font-semibold ${assetType === 'crypto' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-600'}`}
              onClick={() => setAssetType('crypto')}
            >
              <Bitcoin className="w-5 h-5" /> Crypto
            </button>
          </div>
          <Input
            label="Ticker Symbol"
            placeholder="e.g. AAPL or BTC"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            leftIcon={assetType === 'stock' ? <TrendingUp className="w-5 h-5 text-blue-600" /> : <Bitcoin className='w-5 h-5 text-yellow-500' />}
            rightIcon={isValidatingTicker ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : undefined}
            required
            fullWidth
          />
          <div className="grid grid-cols-2 gap-3 mb-2">
            <Input
              label="Quantity"
              placeholder="e.g. 10"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              type="number"
              required
            />
            {/* From Account */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1 text-slate-700">From Account</label>
              <select
                className="w-full h-[42px] rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                required
              >
                <option value="">Select Account</option>
                {accounts.length === 0 ? (
                  <option value="">No accounts found</option>
                ) : (
                  accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Currency Selection */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1 text-slate-700">Currency</label>
              <select
                className="w-full h-[42px] rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={currency}
                onChange={e => setCurrency(e.target.value as 'USD' | 'TWD')}
                required
              >
                <option value="USD">USD</option>
                <option value="TWD">TWD</option>
              </select>
            </div>
            {/* Price per Unit */}
            <Input
              label={`Price per Unit (${currency})`}
              placeholder="e.g. 150.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="float"
              min="0"
              leftIcon={<DollarSign className="w-5 h-5 text-blue-600" />}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Trade Date */}
            <div className="flex flex-col">
              <Input
                type="date"
                label='Trade Date'
                className="w-full h-[42px] rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={tradeDate}
                onChange={e => setTradeDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-400" /> Reason (optional)
            </label>
            <textarea
              className="w-full min-h-[48px] rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-y text-sm"
              placeholder="E.g. Bought on dip, rebalancing, tax loss harvesting, etc."
              value={reason}
              onChange={e => setReason(e.target.value)}
              maxLength={256}
            />
          </div>
          {error && (
            <div className="text-red-600 font-semibold text-center animate-pulse bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div className="flex items-center justify-end">
            <span className="text-sm text-blue-700 font-medium mr-2">Est. Cost:</span>
            <span className="text-sm text-blue-900 font-bold">
              {formatPrice(Number(quantity) * Number(price), currency)}
            </span>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            disabled={!isTickerValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>{trade ? 'Update' : 'Add'} Trade</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TradeEditModal;
