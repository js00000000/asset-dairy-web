import React from 'react';
import { X, TrendingUp, Bitcoin, ArrowUpCircle, ArrowDownCircle, Calendar, DollarSign } from 'lucide-react';

import type { Transaction } from '../../types/transaction';
type DemoTransactionsMap = Record<string, Transaction[]>;

const demoTransactions: DemoTransactionsMap = {
  AAPL: [
    { type: 'buy', date: '2025-04-01', quantity: 5, price: 170.0, account: 'usd', id: 1 },
    { type: 'buy', date: '2025-04-10', quantity: 7, price: 173.5, account: 'usd', id: 2 },
    { type: 'sell', date: '2025-04-15', quantity: 2, price: 175.0, account: 'usd', id: 3 },
  ],
  BTC: [
    { type: 'buy', date: '2025-03-20', quantity: 0.1, price: 60000, account: 'crypto', id: 4 },
    { type: 'buy', date: '2025-04-05', quantity: 0.15, price: 70000, account: 'crypto', id: 5 },
  ],
};

const accountLabels: Record<string, string> = {
  usd: 'Main USD Account',
  crypto: 'Crypto Wallet',
};

type AssetTransactionHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  assetTicker: string;
  assetName: string;
  assetType: string;
};

const AssetTransactionHistoryModal: React.FC<AssetTransactionHistoryModalProps> = ({ open, onClose, assetTicker, assetName, assetType }) => {
  if (!open) return null;
  const transactions = demoTransactions[assetTicker] || [];
  const assetIcon = assetType === 'Stock' ? <TrendingUp className="w-7 h-7 text-blue-600" /> : <Bitcoin className="w-7 h-7 text-yellow-500" />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in overflow-hidden">
        <button
          className="absolute top-5 right-5 text-slate-400 hover:text-red-400 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-8">
          {assetIcon}
          <h2 className="text-2xl font-extrabold text-blue-900 drop-shadow">
            {assetTicker} ({assetName}) — Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-inner">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-50 text-blue-900 text-lg">
                <th className="py-3 px-4 text-left font-bold">Type</th>
                <th className="py-3 px-4 text-left font-bold">Date</th>
                <th className="py-3 px-4 text-left font-bold">Quantity</th>
                <th className="py-3 px-4 text-left font-bold">Price</th>
                <th className="py-3 px-4 text-left font-bold">Account</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-lg">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-blue-50/60 transition">
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      {tx.type === 'buy' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={tx.type === 'buy' ? 'text-green-700' : 'text-red-700'}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="tabular-nums font-mono text-blue-900 font-bold">{tx.quantity}</span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="tabular-nums font-mono text-green-700 font-bold">${tx.price.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-700 font-semibold">{accountLabels[tx.account as keyof typeof accountLabels] || tx.account}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

export default AssetTransactionHistoryModal;
