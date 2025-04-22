import React from 'react';
import { TrendingUp, Bitcoin } from 'lucide-react';

export interface AssetCardProps {
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  averagePrice?: number;
  onClick?: () => void;
  isZero?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({
  ticker,
  name,
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
      className={`bg-white/90 rounded-3xl shadow-2xl px-8 py-7 flex flex-col gap-5 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80 ${isZero ? 'opacity-60 grayscale hover:opacity-90 hover:grayscale-0' : ''}`}
      onClick={onClick}
      title={`Add transaction for ${ticker}`}
    >
      {isZero && (
        <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full shadow">No holdings</span>
      )}
      <div className="flex items-center gap-5 mb-2">
        <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
          {type === 'stock' ? <TrendingUp className="w-6 h-6 text-blue-600" /> : <Bitcoin className="w-6 h-6 text-yellow-500" />}
        </div>
        <div>
          <div className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
            {ticker}
            <span className="text-base font-medium text-gray-500">({name})</span>
          </div>
          <div className="text-sm text-blue-500 mt-1 font-semibold uppercase tracking-wider">{type}</div>
        </div>
      </div>
      <div className="flex gap-10 items-end">
        <div className="flex flex-col">
          <span className="text-lg text-gray-700 font-semibold">Quantity</span>
          <span className="text-2xl font-bold text-blue-700 tabular-nums">{quantity}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg text-gray-700 font-semibold flex items-center gap-1">
            Price
          </span>
          <span className="text-2xl font-bold text-green-600 tabular-nums">
            {price !== null ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <span className="text-gray-400">N/A</span>}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg text-gray-700 font-semibold">Value</span>
          <span className="text-2xl font-bold text-blue-900 tabular-nums">${(price * quantity).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="font-semibold">Average Price:</span>
          <span>${averagePrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-500">Gain/Loss:</span>
          {typeof averagePrice === 'number' && quantity > 0 ? (() => {
            const gainLossAbs = (price - averagePrice) * quantity;
            const gainLossPct = averagePrice !== 0 ? ((price - averagePrice) / averagePrice) * 100 : 0;
            const isGain = gainLossAbs > 0;
            const isLoss = gainLossAbs < 0;
            const color = isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-500';
            return (
              <span className={`flex items-center gap-1 font-bold ${color}`}>
                ${gainLossAbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="ml-1 text-xs font-medium">({gainLossPct >= 0 ? '+' : ''}{gainLossPct.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</span>
              </span>
            );
          })() : <span className="text-gray-400">N/A</span>}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
