import React from 'react';
import { Edit, Trash2, TrendingUp, Bitcoin } from 'lucide-react';
import Button from '@/components/ui/Button';
import ReasonTooltip from '@/components/ui/ReasonTooltip';
import type { Trade } from './trade-types';
import type { Account } from '@/accounts/account-types';
import {formatPrice} from "@/lib/utils.ts";

const assetTypeIcons = {
  stock: <TrendingUp className="w-4 h-4 text-blue-500" />,
  crypto: <Bitcoin className="w-4 h-4 text-orange-400" />,
};

interface TradeCardProps {
  tx: Trade;
  accountMap: Record<string, Account>;
  deletingId: number | null;
  onEdit: (tx: Trade) => void;
  onDelete: (id: number) => void;
  onCancelDelete: () => void;
  onSetDeletingId: (id: number) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({
  tx,
  accountMap,
  deletingId,
  onEdit,
  onDelete,
  onCancelDelete,
  onSetDeletingId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {assetTypeIcons[tx.assetType]}
          <span className="font-medium">{tx.ticker}</span>
        </div>
        <span className={`font-medium ${tx.type === "buy" ? "text-green-600" : "text-red-600"}`}>
          {tx.type.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>Date</div>
        <div className="text-right">{new Date(tx.tradeDate).toLocaleDateString()}</div>
        <div>Quantity</div>
        <div className="text-right">{tx.quantity}</div>
        <div>Price</div>
        <div className="text-right">{formatPrice(tx.price, tx.currency)}</div>
        <div>Account</div>
        <div className="text-right">
          {accountMap[tx.accountId]?.name
            ? `${accountMap[tx.accountId].name} (${accountMap[tx.accountId].currency})`
            : 'Unknown Account'}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
        <ReasonTooltip reason={tx.reason ?? ''} />
        {deletingId === tx.id ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-500 hover:bg-slate-100"
              onClick={onCancelDelete}
              title="Cancel Delete"
            >
              <span className="sr-only">Cancel Delete</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="text-red-600 hover:bg-red-100"
              onClick={() => onDelete(tx.id)}
              title="Confirm Delete"
            >
              <span className="sr-only">Confirm Delete</span>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(tx)}
              title="Edit"
              className="text-blue-500 hover:bg-blue-50"
            >
              <span className="sr-only">Edit</span>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetDeletingId(tx.id)}
              title="Delete"
              className="text-red-500 hover:bg-red-50"
              disabled={deletingId === tx.id}
            >
              <span className="sr-only">Delete</span>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TradeCard; 