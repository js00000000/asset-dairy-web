import React, { useState } from "react";
import AccountCard from '@/accounts/AccountCard';
import type { Account } from '@/accounts/account-types';

interface AccountSummaryListProps {
  accounts: Account[];
  onUpdated?: () => void;
  onEdit?: (accountId: string) => void;
}

export default function AccountSummaryList({ accounts, onUpdated, onEdit }: AccountSummaryListProps) {
  const [displayedAccounts, setDisplayedAccounts] = useState<Account[]>(accounts);

  // Sync local state if accounts prop changes
  React.useEffect(() => {
    setDisplayedAccounts(accounts);
  }, [accounts]);

  const handleDelete = (accountId: string) => {
    setDisplayedAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
    if (onUpdated) onUpdated();
  };

  if (!displayedAccounts.length) return <div className="text-slate-500 p-4">No accounts found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      {displayedAccounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onClick={() => onEdit?.(account.id)}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
