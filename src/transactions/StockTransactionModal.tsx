import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Calendar, ArrowDownCircle, ArrowUpCircle, Bitcoin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { loadAccounts, getCurrentUser } from '../lib/storage-helpers';
import type { Transaction } from '../transactions/transaction-types';
import type { Account } from '../accounts/account-types';

interface StockTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onTransactionsChange: (newTxs: Transaction[]) => void;
  transaction?: Transaction;
  ticker?: string;
  assetType?: string;
}

const StockTransactionModal = ({ open, onClose, onTransactionsChange, transaction, ticker: propTicker, assetType: propAssetType }: StockTransactionModalProps) => {
  const [type, setType] = useState<'buy' | 'sell'>(transaction ? transaction.type : 'buy');
  const [assetType, setAssetType] = useState<'stock' | 'crypto'>(transaction ? transaction.assetType : 'stock');
  const [ticker, setTicker] = useState(transaction ? transaction.ticker : '');
  const [quantity, setQuantity] = useState(transaction ? String(transaction.quantity) : '');
  const [price, setPrice] = useState(transaction ? String(transaction.price) : '');
  const [accountId, setAccountId] = useState(transaction ? transaction.accountId : '');
  const [accounts, setAccounts] = useState<Account[]>([]);

  React.useEffect(() => {
    const user = getCurrentUser();
    const all = loadAccounts();
    if (user) {
      setAccounts(all.filter(acc => acc.ownerId === user.id));
    } else {
      setAccounts([]);
    }
  }, [open]);
  const [date, setDate] = useState(() => {
    if (transaction) return transaction.date;
    // Default to today in YYYY-MM-DD format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset fields when modal opens/closes or transaction changes
  React.useEffect(() => {
    if (open) {
      setType(transaction ? transaction.type : 'buy');
      setAssetType(transaction ? transaction.assetType : (propAssetType === 'stock' || propAssetType === 'crypto' ? propAssetType : 'stock'));
      setTicker(transaction ? transaction.ticker : (propTicker || ''));

      setQuantity(transaction ? String(transaction.quantity) : '');
      setPrice(transaction ? String(transaction.price) : '');
      setAccountId(transaction ? transaction.accountId : '');
      setDate(transaction ? transaction.date : (() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      })());
      setError(null);
      setSuccess(false);
    }
  }, [open, transaction]);

  if (!open) return null;

  const validate = () => {
    if (!ticker.trim() || !quantity || !price || !accountId || !date) {
      setError('All fields are required.');
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
    if (transaction) {
      // Edit mode
      const updatedTx = {
        ...transaction,
        assetType,
        type,
        date,
        quantity: Number(quantity),
        price: Number(price),
        accountId,
        ticker,
      };
      const { updateTransaction, fetchTransactions } = await import('./transaction-api');
      await updateTransaction(transaction.id, updatedTx);
      const updated = await fetchTransactions();
      onTransactionsChange(updated);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } else {
      // Add mode
      const tx = {
        assetType,
        type,
        date,
        quantity: Number(quantity),
        price: Number(price),
        accountId,
        ticker,
      };
      const { createTransaction, fetchTransactions } = await import('./transaction-api');
      await createTransaction(tx as Omit<Transaction, 'id'>);
      const updated = await fetchTransactions();
      onTransactionsChange(updated);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
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
            {transaction ? 'Edit' : type === 'buy' ? 'Record Buy' : 'Record Sell'} Transaction
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
            leftIcon={<TrendingUp className="w-5 h-5 text-blue-600" />}
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
              leftIcon={<DollarSign className="w-5 h-5 text-green-600" />}
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
            {/* Price per Unit */}
            <Input
              label="Price per Unit (USD)"
              placeholder="e.g. 150.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number"
              min="0"
              leftIcon={<DollarSign className="w-5 h-5 text-blue-600" />}
              required
            />
            {/* Date */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1 text-slate-700">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full h-[42px] rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
                <Calendar className="w-4 h-4 text-blue-500 absolute right-3 top-3" />
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 font-semibold text-center animate-pulse">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center animate-pulse">Transaction recorded!</div>}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full flex items-center justify-center gap-2"
          >
            {type === 'buy' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />} Record {type === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StockTransactionModal;
