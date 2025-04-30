import React from 'react';

const TradeEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <span>No trades found.</span>
    </div>
  );
};

export default TradeEmptyState; 