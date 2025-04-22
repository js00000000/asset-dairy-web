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
          <span className="text-lg text-gray-700 font-semibold">Price</span>
          <span className="text-2xl font-bold text-green-600 tabular-nums">${price.toLocaleString()}</span>
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
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">Gain/Loss:</span>
          <span className="text-green-600 font-bold">+0.00%</span> {/* Placeholder */}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
