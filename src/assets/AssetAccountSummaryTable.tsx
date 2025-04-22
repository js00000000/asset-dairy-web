import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

import type { Account } from '../accounts/account-types';

// Local currency conversion utility
function convertToUSD(value: number, currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    TWD: 0.03,
    BTC: 90000,
  };
  const rate = rates[currency] || 1;
  return value * rate;
}

// Asset type as used in AssetPage
export type AssetSummary = {
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  icon?: React.ReactNode;
};

interface AssetAccountSummaryTableProps {
  accounts: Account[];
  assets: AssetSummary[];
}

const AssetAccountSummaryTable: React.FC<AssetAccountSummaryTableProps> = ({ accounts, assets }) => {
  // Convert all to USD for calculations
  const assetRows = assets.map(asset => {
    const valueUSD = convertToUSD(asset.price * asset.quantity, 'USD');
    return {
      id: asset.ticker,
      name: asset.ticker,
      type: 'asset' as const,
      valueUSD,
      displayValue: valueUSD,
      currency: 'USD',
      icon: asset.icon,
      originalValue: asset.price * asset.quantity,
      originalCurrency: 'USD',
    };
  });
  const accountRows = accounts.map(acc => {
    const valueUSD = convertToUSD(acc.balance, acc.currency);
    return {
      id: acc.id,
      name: acc.name,
      type: 'account' as const,
      valueUSD,
      displayValue: valueUSD,
      currency: 'USD',
      icon: undefined,
      originalValue: acc.balance,
      originalCurrency: acc.currency,
    };
  });
  const allRows = [...assetRows, ...accountRows];
  const totalValueUSD = allRows.reduce((sum, row) => sum + row.valueUSD, 0);
  const summaryRows = allRows.map(row => ({
    ...row,
    percentage: totalValueUSD > 0 ? (row.valueUSD / totalValueUSD) * 100 : 0,
  }));

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" /> Asset & Account Summary
        </h2>
        <div className="text-sm text-gray-500 mt-1">Total Value (USD): <span className="font-bold text-indigo-700">${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">% of Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {summaryRows.map((item: typeof allRows[number] & { percentage: number }) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                {item.icon || (item.type === 'account' ? <Wallet className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-blue-500" />)}
                <span className="font-medium text-gray-800">{item.name}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${item.type === 'account' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{item.type === 'account' ? 'Account' : 'Asset'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="font-mono text-gray-700">${item.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs text-gray-400">USD</span></span>
                {item.originalCurrency !== 'USD' && (
                  <div className="text-xs text-gray-400">{item.originalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.originalCurrency}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="font-semibold text-indigo-600">{item.percentage.toFixed(2)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetAccountSummaryTable;
