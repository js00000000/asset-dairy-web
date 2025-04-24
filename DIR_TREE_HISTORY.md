# Asset Dairy Directory Structure (Current)

# This file tracks the EVOLUTION of your directory structure. Legacy/BEFORE trees have been removed for clarity.

## Current Directory Structure (as of 2025-04-24)

src/
├── accounts/         # Account domain
│   ├── account-api.ts
│   ├── account-types.ts
│   └── index.ts
├── portfolio/
│   ├── AccountSummaryList.tsx
│   ├── AssetAccountSummaryTable.tsx
│   ├── AssetCard.tsx
│   ├── PortfolioPage.tsx
│   └── portfolio-api.ts
├── trades/
│   ├── TradeEditModal.tsx
│   ├── TradeListPage.tsx
│   ├── trade-api.ts
│   └── trade-types.ts
├── users/           # User domain
│   ├── ChangePasswordPage.tsx
│   ├── ProfileEditPage.tsx
│   ├── ProfilePage.tsx
│   ├── auth-store.ts
│   ├── user-api.ts
│   ├── user-investment-profile-types.ts
│   └── user-types.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── layout/
│   └── ui/
├── config/
│   └── site.config.ts
├── accounts/
│   ├── account-types.ts

├── users/
│   ├── user-types.ts

├── lib/
│   ├── storage-helpers.ts
├── ... (other unchanged structure)

│   └── mock-data.ts
├── layouts/
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── MainLayout.tsx
├── lib/
│   ├── assetStorage.ts
│   ├── storage-helpers.ts
│   └── utils.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts

---

- This file now only tracks the current state for clarity and maintainability.
- For a full history of moves, refer to your version control history (git log).
