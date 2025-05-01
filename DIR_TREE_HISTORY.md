# Asset Dairy Directory Structure (Current)

# This file tracks the EVOLUTION of your directory structure. Legacy/BEFORE trees have been removed for clarity.

## Current Directory Structure (as of 2025-04-25)

src/
├── accounts/         # Account domain
│   ├── AccountCard.tsx
│   ├── AccountEditModal.tsx
│   ├── account-api.ts
│   ├── account-types.ts
│   └── index.ts
├── auth/             # Authentication domain
│   ├── auth-api.ts
│   └── auth-store.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── layout/
│   └── ui/
├── config/
│   └── site.config.ts
# MIGRATION (2025-04-25):
# The src/layouts/ directory and its files (Footer.tsx, Header.tsx, MainLayout.tsx) have been removed.
# All layout components now reside in src/components/layout/ according to project structure rules.
├── lib/
│   ├── assetStorage.ts
│   ├── storage-helpers.ts
│   └── utils.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── portfolio/        # Portfolio and asset tracking
│   ├── AccountSummaryList.tsx
│   ├── AssetAccountSummaryTable.tsx
│   ├── AssetCard.tsx
│   ├── PortfolioPage.tsx
│   └── portfolio-api.ts
├── profile/          # User profile domain
│   ├── ChangePasswordPage.tsx
│   ├── ProfileEditPage.tsx
│   ├── ProfilePage.tsx
│   ├── profile-api.ts
│   ├── user-investment-profile-types.ts
│   └── user-types.ts
├── trades/           # Trades domain
│   ├── TradeEditModal.tsx
│   ├── TradeListPage.tsx
│   ├── trade-api.ts
│   └── trade-types.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts

---

- This file now only tracks the current state for clarity and maintainability.
- For a full history of moves, refer to your version control history (git log).
