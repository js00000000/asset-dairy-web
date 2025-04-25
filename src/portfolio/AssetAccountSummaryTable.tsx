import React from 'react';
import { Wallet, TrendingUp, Clipboard, ClipboardCheck, Bot } from 'lucide-react';

import type { Account } from '../accounts/account-types';
import { useEffect, useState } from 'react';
import { fetchProfile } from '../profile/profile-api';
import type { User } from '../profile/user-types';

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

// Asset type as used in PortfolioPage
export type AssetSummary = {
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  averagePrice: number;
  icon?: React.ReactNode;
};

interface AssetAccountSummaryTableProps {
  accounts: Account[];
  assets: AssetSummary[];
}

const AssetAccountSummaryTable: React.FC<AssetAccountSummaryTableProps> = ({ accounts, assets }) => {
  // Get user and investment profile from profile API
  const [user, setUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);
  const investmentProfile = user?.investmentProfile;
  // Export handler: export only assetRows as JSON with ticker, valueUSD, percentage
  const [copied, setCopied] = React.useState(false);
  const [aiCopied, setAiCopied] = React.useState(false);

  // Helper to get export JSON string
  const getPortfolioJson = () => {
    const assetExportRows = assets.map(asset => {
      const valueUSD = convertToUSD(asset.price * asset.quantity, 'USD');
      return {
        type: asset.type,
        ticker: asset.ticker,
        assetName: null,
        valueUSD,
        currentPrice: asset.price,
        averageCost: asset.averagePrice,
      };
    });
    const accountExportRows = accounts.map(acc => {
      const valueUSD = convertToUSD(acc.balance, acc.currency);
      return {
        type: 'cash',
        ticker: null,
        assetName: acc.name,
        valueUSD,
        averageCost: 0,
        currentPrice: 0,
      };
    });
    const allExportRows = [...assetExportRows, ...accountExportRows];
    const totalValueUsd = allExportRows.reduce((sum, row) => sum + row.valueUSD, 0);
    const exportData = allExportRows.map(row => ({
      assetType: row.type,
      ticker: row.ticker,
      assetName: row.assetName,
      valueUsd: Number(row.valueUSD.toFixed(2)),
      percentage: totalValueUsd > 0 ? Number(((row.valueUSD / totalValueUsd) * 100).toFixed(2)) : 0,
      currentPrice: Number(row.currentPrice.toFixed(2)),
      averageCost: Number(row.averageCost.toFixed(2)),
    }));
    const today = new Date('2025-04-23T00:00:00.000Z');
    // Use local time, format YYYY-MM-DD
    const dateStr = today.toISOString().slice(0, 10);
    return JSON.stringify({
      exportDate: dateStr,
      totalValueUsd: Number(totalValueUsd.toFixed(2)),
      portfolio: exportData
    }, null, 2);
  };

  const handleCopy = async () => {
    const jsonStr = getPortfolioJson();
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAskAICopy = async () => {
    const jsonStr = getPortfolioJson();
    let profileStr = '';
    if (loadingProfile) {
      profileStr = 'User Investment Profile: Loading...';
    } else if (investmentProfile) {
      profileStr = `User Investment Profile:\n- Age: ${investmentProfile.age}\n- Max Acceptable Short-Term Loss: ${investmentProfile.maxAcceptableShortTermLossPercentage}%\n- Expected Annualized Rate of Return: ${investmentProfile.expectedAnnualizedRateOfReturn}%\n- Time Horizon: ${investmentProfile.timeHorizon}\n- Years Investing: ${investmentProfile.yearsInvesting}`;
    } else {
      profileStr = 'User Investment Profile: Not provided';
    }
    const prompt = `You are an senior investment advisor. Here is my portfolio data in JSON. Please review and provide advices on possible improvements based on macroeconomic to reach my investment goal.\n\n${profileStr}\n\nPortfolio Data:\n${jsonStr}`;
    await navigator.clipboard.writeText(prompt);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 1500);
  };

  // Convert all to USD for calculations
  const assetRows = assets.map(asset => {
    const valueUSD = convertToUSD(asset.price * asset.quantity, 'USD');
    return {
      id: asset.ticker,
      name: asset.ticker,
      type: asset.type,
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
      type: 'cash',
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
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Asset & Account Summary
          </h2>
          <div className="text-sm text-gray-500 mt-1">Total Value (USD): <span className="font-bold text-indigo-700">${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center mt-3 sm:mt-0">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow transition font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${copied ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
            title={copied ? 'Copied!' : 'Copy Asset & Account Summary as JSON'}
          >
            {copied ? <ClipboardCheck className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={handleAskAICopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow transition font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${aiCopied ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
            title={
              aiCopied
                ? 'Copied!'
                : 'Copy AI Prompt'
            }
            disabled={loadingProfile}
            style={{ opacity: loadingProfile ? 0.6 : 1, cursor: loadingProfile ? 'not-allowed' : 'pointer' }}
          >
            <Bot className="w-4 h-4" /> {aiCopied ? 'Copied!' : 'Ask AI'}
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Type</th>
            <th className="px-3 py-2 text-right text-xs sm:px-6 sm:py-3 sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Value</th>
            <th className="px-3 py-2 text-right text-xs sm:px-6 sm:py-3 sm:text-sm font-medium text-gray-600 uppercase tracking-wider">% of Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {summaryRows.map((item: typeof allRows[number] & { percentage: number }) => (
            <tr key={item.id}>
              <td className="px-3 py-2 whitespace-nowrap flex items-center gap-2 text-xs sm:px-6 sm:py-4 sm:text-sm">
                {item.icon || (item.type === 'cash' ? <Wallet className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-blue-500" />)}
                <span className="font-medium text-gray-800">{item.name}</span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs sm:px-6 sm:py-4 sm:text-sm">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${item.type === 'cash' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{item.type === 'cash' ? 'cash' : item.type}</span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right text-xs sm:px-6 sm:py-4 sm:text-sm">
                <span className="font-mono text-gray-700">${item.valueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs text-gray-400">USD</span></span>
                {item.originalCurrency !== 'USD' && (
                  <div className="text-xs text-gray-400">{item.originalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.originalCurrency}</div>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right text-xs sm:px-6 sm:py-4 sm:text-sm">
                <span className="font-semibold text-indigo-600">{item.percentage.toFixed(2)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetAccountSummaryTable;
