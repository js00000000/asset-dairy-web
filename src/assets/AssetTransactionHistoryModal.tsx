import React from 'react';
import { X, TrendingUp, Bitcoin } from 'lucide-react';
import type { Transaction } from '../transactions/transaction-types';
import { useState } from 'react';
import { updateTransaction, deleteTransaction, fetchTransactions } from '../transactions/transaction-api';
import { Pencil, Trash2, Check, X as LucideX } from 'lucide-react';

interface AssetTransactionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  assetTicker: string;
  assetName: string;
  assetType: string;
  transactions: Transaction[];
  onTransactionsChange: (txs: Transaction[]) => void;
}

const AssetTransactionHistoryModal: React.FC<AssetTransactionHistoryModalProps> = ({ open, onClose, assetTicker, assetName, assetType, transactions, onTransactionsChange }) => {
  if (!open) return null;
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<{ id: string; name: string; currency: string }[]>([]);
  React.useEffect(() => {
    // Use ES module import
    import('../lib/storage-helpers').then(({ getCurrentUser, loadAccounts }) => {
      const user = getCurrentUser();
      const all = loadAccounts();
      if (user) {
        setAccounts(all.filter(acc => acc.ownerId === user.id));
      } else {
        setAccounts([]);
      }
    });
  }, []);
  const filteredTransactions = transactions.filter(tx => tx.ticker === assetTicker);
  const assetIcon = assetType === 'Stock' ? <TrendingUp className="w-7 h-7 text-blue-600" /> : <Bitcoin className="w-7 h-7 text-yellow-500" />;

  // Handle edit
  const handleEditClick = (tx: Transaction) => {
    setEditId(tx.id);
    setEditForm({ ...tx });
  };
  const handleEditChange = (field: keyof Transaction, value: string | number) => {
    setEditForm({ ...editForm, [field]: value });
  };
  const handleEditSave = async () => {
    if (!editId) return;
    await updateTransaction(editId, editForm);
    const updated = await fetchTransactions();
    onTransactionsChange(updated);
    setEditId(null);
    setEditForm({});
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  // Handle delete
  const handleDeleteClick = (id: number) => setDeleteId(id);
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteTransaction(deleteId);
    const updated = await fetchTransactions();
    onTransactionsChange(updated);
    setDeleteId(null);
  };
  const handleDeleteCancel = () => setDeleteId(null);

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
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-50 text-blue-900 text-lg">
                <th className="py-3 px-4 text-left font-bold w-28">Type</th>
                <th className="py-3 px-4 text-left font-bold w-32">Date</th>
                <th className="py-3 px-4 text-right font-bold w-28">Quantity</th>
                <th className="py-3 px-4 text-right font-bold w-32">Price</th>
                <th className="py-3 px-4 text-left font-bold w-48">Account</th>
                <th className="py-3 px-4 text-center font-bold w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400 font-semibold">
                    <div className="flex flex-col items-center gap-4">
                      <img src="https://img.freepik.com/free-vector/illustration-of-empty-box_53876-104982.jpg?w=2000" alt="Empty state illustration" className="w-40 h-40" />
                      <span>No transactions yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0 hover:bg-blue-50/40 transition">
                    {/* Edit mode */}
                    {editId === tx.id ? (
                      <>
                        <td className="py-3 px-4">
                          <select value={editForm.type} onChange={e => handleEditChange('type', e.target.value as 'buy' | 'sell')} className="border rounded px-2 py-1 w-full">
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input type="date" value={editForm.date as string} onChange={e => handleEditChange('date', e.target.value)} className="border rounded px-2 py-1 w-full" />
                        </td>
                        <td className="py-3 px-4">
                          <input type="number" value={editForm.quantity as number} onChange={e => handleEditChange('quantity', Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
                        </td>
                        <td className="py-3 px-4">
                          <input type="number" value={editForm.price as number} onChange={e => handleEditChange('price', Number(e.target.value))} className="border rounded px-2 py-1 w-24" />
                        </td>
                        <td className="py-3 px-4">
                          <select value={editForm.account} onChange={e => handleEditChange('account', e.target.value)} className="border rounded px-2 py-1 w-full">
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
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button onClick={handleEditSave} className="text-green-600 hover:bg-green-50 rounded p-1 transition"><Check className="w-5 h-5" /></button>
                          <button onClick={handleEditCancel} className="text-gray-400 hover:bg-gray-100 rounded p-1 transition"><LucideX className="w-5 h-5" /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-bold text-left align-middle">
                          <span className={tx.type === 'buy' ? 'text-green-700' : 'text-red-700'}>{tx.type.toUpperCase()}</span>
                        </td>
                        <td className="py-3 px-4 text-left align-middle">{tx.date}</td>
                        <td className="py-3 px-4 font-mono text-right align-middle">{tx.quantity}</td>
                        <td className="py-3 px-4 font-mono text-blue-800 text-right align-middle">${tx.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-left align-middle">{accounts.find(acc => acc.id === tx.account)?.name || tx.account}</td>
                        <td className="py-3 px-4 flex gap-2 justify-center min-w-[100px] align-middle">
                          <button onClick={() => handleEditClick(tx)} className="text-blue-500 hover:bg-blue-50 rounded p-1 transition"><Pencil className="w-5 h-5" /></button>
                          <button onClick={() => handleDeleteClick(tx.id)} className="text-red-500 hover:bg-red-50 rounded p-1 transition"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Delete confirmation dialog */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6">
              <div className="text-xl font-bold text-red-700 flex gap-2 items-center"><Trash2 className="w-6 h-6" /> Delete Transaction?</div>
              <div className="text-gray-600">Are you sure you want to permanently delete this transaction?</div>
              <div className="flex gap-4 mt-2">
                <button onClick={handleDeleteConfirm} className="bg-red-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-700 transition">Delete</button>
                <button onClick={handleDeleteCancel} className="bg-gray-200 text-gray-600 px-5 py-2 rounded-lg font-bold hover:bg-gray-300 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetTransactionHistoryModal;
