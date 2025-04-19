# Feature TODO List for Asset Dairy

> Updated: 2025-04-19
> Backend/user-specific account CRUD, ownership enforcement, and storage helpers refactor complete.

This document tracks all major features for the Asset Dairy app, prioritized for a beautiful, production-ready personal finance and portfolio management experience. Check off features as they are implemented.

## 1. Account Management
- [x] Create Account UI (beautiful form, validation, modal)
- [~] Integrate backend logic for account creation <!-- mock/localStorage only, user-specific, ownership enforced -->
- [x] Edit Account UI (modal, beautiful, validation, user-specific/ownership enforced)
- [x] Delete Account UI (modal, confirmation, beautiful, user-specific/ownership enforced)
- [x] List accounts with balances
    - [x] Design beautiful accounts list UI (responsive, Tailwind, Lucide, Pexels [photo removed for minimalism])
    - [x] Fetch accounts data from mock API/localStorage
    - [x] Display account name, currency, and current balance
    - [x] Add loading, error, and empty states
    - [x] Add navigation to Create/Edit/Delete actions (all via modal, not navigation)
- [ ] Multi-currency support (UI only, no backend conversion)

## 2. Transaction Management
- [ ] Record expense (select account, amount, category, note, date)
- [ ] Record income (select account, amount, category, note, date)
- [ ] Record transfer (from/to accounts, amount, note, date; auto-update balances)
- [ ] Edit/delete transactions
- [ ] Transaction history and filtering

## 3. Stock & Crypto Transactions
### 3.1. Record Stock/Crypto Buy/Sell Transaction UI
- [x] Beautiful modal/form for recording a buy/sell (ticker, quantity, price, from account, date) — UI implemented and integrated on Asset page (/asset)
- [x] Validation and feedback (Tailwind, Lucide, Pexels)

### 3.2. Holdings & Transaction History UI
- [x] 3.2a: Display holdings per asset (stock/crypto), with beautiful UI — Asset page now features a modern, production-worthy summary for each asset, using Tailwind, Lucide, and Pexels
- [x] 3.2b: Show transaction history for each asset — Modal implemented, accessible for all assets (even with zero quantity), with beautiful, production-worthy UI and full click support for history.

### 3.3. Account Balance Auto-Update Logic
- [ ] Automatically update account balances when a stock/crypto transaction is recorded

### 3.4. (Optional) Backend/Storage Integration
- [ ] Persist stock/crypto transactions and holdings (mock/localStorage or backend, as appropriate)

## 4. Portfolio Dashboard
- [ ] Overview of all accounts, stock, and crypto assets
- [ ] Current balances and portfolio value (multi-currency conversion if needed)
- [ ] Charts: asset allocation, balance over time, recent transactions
- [ ] Quick actions (add transaction, add account)

## 5. General & UI
- [ ] Beautiful, responsive UI (Tailwind, Lucide, Pexels)
- [x] Extracted storage helpers for cleaner API code
- [ ] Accessibility and error handling
- [ ] Dark/light mode
