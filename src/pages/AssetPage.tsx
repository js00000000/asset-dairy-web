import React, { useState } from 'react';
import { PlusCircle, TrendingUp, Bitcoin, LineChart } from 'lucide-react';
import Button from '../components/ui/Button';
import StockTransactionModal from '../components/stock/StockTransactionModal';
import AssetTransactionHistoryModal from '../components/stock/AssetTransactionHistoryModal';

// Demo/mock: all assets with transactions, including those with 0 quantity
const demoAssets = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: 'Stock',
    quantity: 12,
    price: 172.34,
    icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
  },
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    type: 'Crypto',
    quantity: 0.25,
    price: 65000,
    icon: <Bitcoin className="w-6 h-6 text-yellow-500" />,
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    type: 'Stock',
    quantity: 0,
    price: 220.0,
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
  },
];

const AssetPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyModal, setHistoryModal] = useState<null | { ticker: string; name: string; type: string }>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 drop-shadow-lg flex items-center gap-3">
            <LineChart className="w-8 h-8 text-blue-700" /> Asset Portfolio
          </h1>
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2 shadow-xl"
            onClick={() => setModalOpen(true)}
          >
            <PlusCircle className="w-5 h-5" /> Add Transaction
          </Button>
        </div>
        <div className="relative z-10">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
            <img
              src="https://images.pexels.com/photos/5833760/pexels-photo-5833760.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Asset background"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8 relative">
            {demoAssets.map((asset) => {
              const isZero = asset.quantity === 0;
              return (
                <div
                  key={asset.ticker}
                  className={`bg-white/90 rounded-3xl shadow-2xl px-8 py-7 flex flex-col gap-5 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80 ${isZero ? 'opacity-60 grayscale hover:opacity-90 hover:grayscale-0' : ''}`}
                  onClick={() => setHistoryModal({ ticker: asset.ticker, name: asset.name, type: asset.type })}
                  title={`View transaction history for ${asset.ticker}`}
                >
                  {isZero && (
                    <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full shadow">No holdings</span>
                  )}
                  <div className="flex items-center gap-5 mb-2">
                    <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
                        {asset.ticker}
                        <span className="text-base font-medium text-gray-500">({asset.name})</span>
                      </div>
                      <div className="text-sm text-blue-500 mt-1 font-semibold uppercase tracking-wider">{asset.type}</div>
                    </div>
                  </div>
                  <div className="flex gap-10 items-end">
                    <div className="flex flex-col">
                      <span className="text-lg text-gray-700 font-semibold">Quantity</span>
                      <span className="text-2xl font-bold text-blue-700 tabular-nums">{asset.quantity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg text-gray-700 font-semibold">Price</span>
                      <span className="text-2xl font-bold text-green-600 tabular-nums">${asset.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg text-gray-700 font-semibold">Value</span>
                      <span className="text-2xl font-bold text-blue-900 tabular-nums">${(asset.price * asset.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-semibold">Gain/Loss:</span>
                      <span className="text-green-600 font-bold">+0.00%</span> {/* Placeholder */}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Last updated:</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <img
            src="https://images.pexels.com/photos/6693657/pexels-photo-6693657.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Stock market illustration"
            className="rounded-xl shadow-2xl max-w-md w-full border-4 border-white/20"
          />
        </div>
      </div>
      <StockTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <AssetTransactionHistoryModal
        open={!!historyModal}
        onClose={() => setHistoryModal(null)}
        assetTicker={historyModal?.ticker || ''}
        assetName={historyModal?.name || ''}
        assetType={historyModal?.type || ''}
      />
    </div>
  );
};

export default AssetPage;
