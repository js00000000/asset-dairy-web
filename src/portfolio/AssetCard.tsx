import React from 'react';
import { TrendingUp, Bitcoin } from 'lucide-react';

export interface AssetCardProps {
  ticker: string;
  type: string;
  quantity: number;
  price: number;
  averagePrice?: number;
  onClick?: () => void;
  isZero?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({
  ticker,
  type,
  quantity,
  price,
  averagePrice,
  onClick,
  isZero = false,
}) => {
  // Real-time price state
  return (
    <div
      className={`bg-white/90 rounded-3xl shadow-2xl px-6 py-6 flex flex-col gap-6 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80 ${
        isZero ? 'opacity-60 grayscale hover:opacity-90 hover:grayscale-0' : ''
      }`}
      onClick={onClick}
      title={`Add trade for ${ticker}`}
    >
      {isZero && (
        <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full shadow">
          No holdings
        </span>
      )}

      {/* Header: Icon, Ticker, Name, Type, Price */}
      <div className="flex items-center justify-between mb-1 w-full">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
            {type === 'stock' ? (
              <TrendingUp className="w-6 h-6 text-blue-600" />
            ) : (
              <Bitcoin className="w-6 h-6 text-yellow-500" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
              {ticker}
            </span>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-0.5">
              {type}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[90px]">
          <span className="text-xs text-gray-500 font-medium">Price</span>
          <span className="text-2xl font-bold text-green-600 tabular-nums">
            {price !== null ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <span className="text-gray-400">N/A</span>}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 mb-1" />

      {/* Main Value Row: Quantity (left) and Value (right) */}
      <div className="flex flex-row justify-between items-end gap-6 w-full px-1">
        <div className="flex flex-col items-start">
          <span className="text-base text-gray-700 font-semibold flex items-center gap-1">Quantity</span>
          <span className="text-2xl font-bold text-blue-700 tabular-nums break-words">{quantity}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-base text-gray-700 font-semibold flex items-center gap-1">Value</span>
          <span className="text-2xl font-bold text-blue-900 tabular-nums break-words">${(price * quantity).toLocaleString()}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100" />

      {/* Footer: Average Price & Gain/Loss */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold flex items-center gap-1">
            Avg. Price:
          </span>
          <span className="text-blue-700 font-bold">{averagePrice !== undefined ? `$${averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <span className="text-gray-400">N/A</span>}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-500">Gain/Loss:</span>
          {typeof averagePrice === 'number' && quantity > 0 ? (() => {
            const gainLossAbs = (price - averagePrice) * quantity;
            const gainLossPct = averagePrice !== 0 ? ((price - averagePrice) / averagePrice) * 100 : 0;
            const isGain = gainLossAbs > 0;
            const isLoss = gainLossAbs < 0;
            const color = isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-500';
            const absValue = Math.abs(gainLossAbs).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const absPct = Math.abs(gainLossPct).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const sign = isGain ? '+' : isLoss ? '-' : '';
            return (
              <span className={`flex flex-col items-start font-bold ${color}`}>
                <span className="text-base">{sign} ${absValue}</span>
                <span className="text-xs font-medium mt-0.5 opacity-80">{sign}{absPct}%</span>
              </span>
            );
          })() : <span className="text-gray-400">N/A</span>}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
