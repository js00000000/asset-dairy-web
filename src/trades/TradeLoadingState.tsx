import React from 'react';
import { Loader2 } from 'lucide-react';

const TradeLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      <span className="ml-3 text-slate-500">Loading trades...</span>
    </div>
  );
};

export default TradeLoadingState; 