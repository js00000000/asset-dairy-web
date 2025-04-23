import React from "react";
import { Wallet } from "lucide-react";
import type { Account } from "./account-types";

export interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  TWD: "NT$",
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  return (
    <div
      className="bg-white/90 rounded-3xl shadow-2xl px-6 py-6 flex flex-col gap-6 border border-blue-200 transition-transform group backdrop-blur-xl cursor-pointer relative hover:scale-[1.025] hover:shadow-blue-200/80"
      onClick={onClick}
      title={`Edit account: ${account.name}`}
    >
      {/* Header: Icon, Account Name, Currency, Balance */}
      <div className="flex items-center justify-between mb-1 w-full">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-xl p-3 shadow group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-blue-900 flex items-center gap-2 drop-shadow">
              {account.name}
            </span>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-0.5">
              {account.currency}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[90px]">
          <span className="text-xs text-gray-500 font-medium">Balance</span>
          <span className="text-2xl font-bold text-green-600 tabular-nums">
            {currencySymbols[account.currency] || account.currency + " "}
            {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
