import React, { useState } from "react";
import { Info } from "lucide-react";
import Button from './Button';

interface ReasonTooltipProps {
  reason: string;
}

const ReasonTooltip: React.FC<ReasonTooltipProps> = ({ reason }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <Button
        size="sm"
        variant="ghost"
        className="text-slate-500 hover:bg-slate-100"
        onClick={() => setShow((prev) => !prev)}
        title="Show reason"
      >
        <span className="sr-only">Show reason</span>
        <Info className="w-4 h-4" />
      </Button>
      {show && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-lg shadow-lg bg-white border border-slate-200 text-sm text-slate-700 animate-fade-in">
          <div className="font-semibold mb-1 text-blue-600 flex items-center gap-1">
            <Info className="w-3 h-3" /> Reason
          </div>
          <div className="break-words whitespace-pre-line">{reason || <span className='italic text-slate-400'>No reason provided.</span>}</div>
        </div>
      )}
    </div>
  );
};

export default ReasonTooltip;
