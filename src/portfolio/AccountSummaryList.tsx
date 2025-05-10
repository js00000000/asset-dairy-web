import AccountCard from '@/accounts/AccountCard';
import type { Account } from '@/accounts/account-types';

interface AccountSummaryListProps {
  accounts: Account[];
  onEdit?: (accountId: string) => void;
}

export default function AccountSummaryList({ accounts, onEdit }: AccountSummaryListProps) {
  if (!accounts.length) return <div className="text-slate-500 p-4">No accounts found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onClick={() => onEdit?.(account.id)}
        />
      ))}
    </div>
  );
}
