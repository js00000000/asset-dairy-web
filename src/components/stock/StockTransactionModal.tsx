import React, { useState } from 'react';
import { X, TrendingUp, Bitcoin, DollarSign, Calendar, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const accountOptions = [
  { label: 'Main USD Account', value: 'usd' },
  { label: 'Crypto Wallet', value: 'crypto' },
];

const assetOptions = [
  { label: 'Stock', icon: <TrendingUp className="w-5 h-5 text-blue-600" /> },
  { label: 'Crypto', icon: <Bitcoin className="w-5 h-5 text-yellow-500" /> },
];

const StockTransactionModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [account, setAccount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const validate = () => {
    if (!ticker.trim() || !quantity || !price || !account || !date) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
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
          <h2 className="text-2xl font-extrabold text-blue-900 drop-shadow">{type === 'buy' ? 'Record Buy' : 'Record Sell'} Transaction</h2>
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
          <Input
            label="Ticker Symbol"
            placeholder="e.g. AAPL or BTC"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            leftIcon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            required
            fullWidth
          />
          <div className="flex gap-4">
            <Input
              label="Quantity"
              placeholder="e.g. 10"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              type="number"
              min="0"
              leftIcon={<DollarSign className="w-5 h-5 text-green-600" />}
              required
              fullWidth
            />
            <Input
              label="Price per Unit (USD)"
              placeholder="e.g. 150.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number"
              min="0"
              leftIcon={<DollarSign className="w-5 h-5 text-blue-600" />}
              required
              fullWidth
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-slate-700">From Account</label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={account}
                onChange={e => setAccount(e.target.value)}
                required
              >
                <option value="">Select Account</option>
                {accountOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-slate-700">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
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
        <div className="mt-8 flex justify-center">
          <img
            src="https://images.pexels.com/photos/6693657/pexels-photo-6693657.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Stock market illustration"
            className="rounded-xl shadow-xl max-w-xs border-2 border-blue-100"
          />
        </div>
      </div>
    </div>
  );
};

export default StockTransactionModal;
