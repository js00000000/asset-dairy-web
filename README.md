# Asset Dairy

Asset Dairy is a modern web application for tracking your personal finances and investment portfolios. Effortlessly log daily expenses, income, and transfers, and manage your stock and cryptocurrency trades in one beautiful dashboard.

## Features

- **Account Management**: Create, edit, and manage secure user accounts with beautiful UI and validation.
- **Authentication**: Secure login and registration system with protected routes.
- **Portfolio Tracking**: Track your stock and crypto holdings with real-time price updates.
- **Trade Management**: Record and manage stock and crypto trades with detailed transaction history.
- **Modern UI**: Clean, responsive, and production-ready interface built with React, Tailwind CSS, and Lucide React icons.
- **Data Visualization**: Beautiful dashboards for portfolio overview and asset allocation.
- **User Profile**: Manage your profile settings and investment preferences.
- **Security**: Protected routes and secure data handling with user-specific ownership enforcement.

*Coming Soon:*
- Multi-currency support
- Transaction management (expenses, income, transfers)
- Advanced portfolio analytics and charts
- Dark/light mode
- Accessibility improvements

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
This project follows a strict domain-driven folder structure for clarity, scalability, and maintainability. Each domain folder contains its own pages, components, types, and API/services. The current structure is as follows (as of 2025-04-25):

```
src/
├── accounts/        # Account management (pages, types, API, modals)
│   ├── AccountCard.tsx
│   ├── AccountEditModal.tsx
│   ├── account-api.ts
│   ├── account-types.ts
│   └── index.ts
├── auth/            # Authentication domain
│   ├── auth-api.ts
│   └── auth-store.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── layout/
│   └── ui/
├── config/
│   └── site.config.ts
├── lib/
│   ├── assetStorage.ts
│   ├── storage-helpers.ts
│   └── utils.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── portfolio/       # Portfolio and asset tracking (pages, types, API)
│   ├── AccountSummaryList.tsx
│   ├── AssetAccountSummaryTable.tsx
│   ├── AssetCard.tsx
│   ├── PortfolioPage.tsx
│   └── portfolio-api.ts
├── profile/         # User profile domain
│   ├── ChangePasswordPage.tsx
│   ├── ProfileEditPage.tsx
│   ├── ProfilePage.tsx
│   ├── profile-api.ts
│   ├── user-investment-profile-types.ts
│   └── user-types.ts
├── trades/          # Trades logging and history
│   ├── TradeEditModal.tsx
│   ├── TradeListPage.tsx
│   ├── trade-api.ts
│   └── trade-types.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
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
