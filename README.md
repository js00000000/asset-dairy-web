# Asset Dairy

Asset Dairy is a modern web application for tracking your personal finances and investment portfolios. Effortlessly log daily expenses, income, and transfers, and manage your stock and cryptocurrency trades in one beautiful dashboard.

## Features

- **Account Setup**: Create and manage secure user accounts.
- **Expense & Income Logging**: Record daily expenses, income, and transfers with ease.
- **Portfolio Tracking**: Track your stock and crypto holdings, trades, and portfolio value over time.
- **Modern UI**: Clean, responsive, and production-ready interface built with React, Tailwind CSS, and Lucide React icons.
- **Data Insights**: Visualize spending, income, and asset allocation.

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/your-username/asset-dairy.git
cd asset-dairy
npm install # or yarn install
```

### Running the App
```bash
npm run dev # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Tech Stack
- **React** (with hooks) for UI
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development
- **TypeScript** for type safety

## Project Structure
This project follows a strict domain-driven folder structure for clarity, scalability, and maintainability. Each domain folder contains its own pages, components, types, and API/services. The current structure is as follows:

```
src/
├── accounts/        # Account management (pages, types, API, modals)
│   ├── AccountCard.tsx
│   ├── AccountEditModal.tsx
│   ├── account-api.ts
│   ├── account-types.ts
│   └── index.ts
├── portfolio/       # Portfolio and asset tracking (pages, types, API)
│   ├── AccountSummaryList.tsx
│   ├── AssetAccountSummaryTable.tsx
│   ├── AssetCard.tsx
│   ├── PortfolioPage.tsx
│   └── portfolio-api.ts
├── trades/          # Trades logging and history
│   ├── TradeEditModal.tsx
│   ├── TradeListPage.tsx
│   ├── trade-api.ts
│   └── trade-types.ts
├── users/           # User profiles, authentication, settings
│   ├── ChangePasswordPage.tsx
│   ├── ProfileEditPage.tsx
│   ├── ProfilePage.tsx
│   ├── auth-store.ts
│   ├── user-api.ts
│   ├── user-investment-profile-types.ts
│   └── user-types.ts
├── components/      # Shared UI components
│   ├── ProtectedRoute.tsx
│   ├── layout/      # App-wide layout components (Header, Footer, etc.)
│   └── ui/          # Generic, reusable UI elements
├── config/          # App/site configuration
│   └── site.config.ts
├── layouts/         # Layout wrappers
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── MainLayout.tsx
├── lib/             # Utilities and helpers
│   ├── assetStorage.ts
│   ├── storage-helpers.ts
│   └── utils.ts
├── accounts/         # Account domain
├── users/           # User domain
│   ├── mock-accounts.ts
│   └── mock-data.ts
├── pages/           # App-wide pages (Home, Login, Register, NotFound)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
```
- Types/interfaces are placed in their primary domain folder (e.g., `accounts/account-types.ts`).
- Only global types go in `src/types/` (if needed).
- Test files should mirror the domain structure in a `__tests__/` or `tests/` folder.

## Enforced Conventions
- **No legacy imports**: Always import from domain-driven paths.
- **Keep [DIR_TREE_HISTORY.md](./DIR_TREE_HISTORY.md) up to date** with any structure changes.
- **Update [FEATURE_TODO.md](./FEATURE_TODO.md)** for ongoing and planned features.
- **Remove empty legacy folders** after migration.
- **UI Consistency**: All UI uses Tailwind, Lucide, and React hooks by default.

## Contribution Guidelines
- Follow the domain-driven folder structure for all new features.
- Update DIR_TREE_HISTORY.md and FEATURE_TODO.md as required.
- Use only the approved UI stack (React, Tailwind, Lucide) unless otherwise specified.
- See the user rules in the repo for full enforcement details.

## License
MIT License

---

*Designed for modern finance tracking and portfolio management. Beautiful, production-ready, and organized for scale.*
