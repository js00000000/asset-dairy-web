import { useState } from "react";
import AccountCard from "../accounts/AccountCard";
import type { Account } from "../accounts/account-types";
import AccountEditModal from "../accounts/AccountEditModal";

interface AccountSummaryListProps {
  accounts: Account[];
  onUpdated?: () => void;
}

export default function AccountSummaryList({ accounts, onUpdated }: AccountSummaryListProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!accounts.length) return <div className="text-slate-500 p-4">No accounts found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onClick={() => {
              setEditId(account.id);
              setModalOpen(true);
            }}
          />
        ))}
      </div>
      <AccountEditModal
        open={modalOpen}
        accountId={editId}
        onClose={() => {
          setModalOpen(false);
          setEditId(null);
        }}
        onUpdated={onUpdated ?? (() => {})}
      />
    </>
  );
}
