# Asset Dairy Directory Structure (Current)

# This file tracks the EVOLUTION of your directory structure. Legacy/BEFORE trees have been removed for clarity.

## Current Directory Structure (as of 2025-04-22)

src/
├── accounts/
│   ├── AccountCreateModal.tsx
│   ├── AccountEditModal.tsx
│   ├── AccountListPage.tsx
│   ├── account-types.ts
│   └── index.ts
├── portfolio/
│   ├── PortfolioPage.tsx
│   ├── portfolio-api.ts
│   └── AssetAccountSummaryTable.tsx
├── transactions/
│   ├── StockTransactionModal.tsx
│   ├── transaction-api.ts
│   └── transaction-types.ts
├── users/
│   ├── ChangePasswordPage.tsx
│   ├── ProfileEditPage.tsx
│   ├── ProfilePage.tsx
│   └── user-types.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── account/
│   ├── layout/
│   ├── stock/
│   └── ui/
├── lib/
│   ├── assetStorage.ts
│   ├── storage-helpers.ts
│   └── utils.ts
├── data/
│   ├── mock-accounts.ts
│   └── mock-data.ts
├── services/
│   └── api.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
└── ... (other folders: config, layouts, modules, store)

---

- This file now only tracks the current state for clarity and maintainability.
- For a full history of moves, refer to your version control history (git log).
