# Elite Marketplace

A modern, full-featured e-commerce platform built with React, TypeScript, Zustand, Vite, and Tailwind CSS. Elite Marketplace allows buyers to browse, shop, and purchase products from trusted sellers, while sellers can manage their products and view sales analytics via a dedicated dashboard.

## Features

### For Buyers
- **Product Browsing:** View products by category, featured, popular, and new arrivals.
- **Product Details:** See detailed product pages with images, pricing, discounts, reviews, and related products.
- **Shopping Cart:** Add, remove, and update quantities of products in your cart.
- **Checkout:** Secure checkout flow with shipping and payment information.
- **Order Confirmation:** Receive order confirmation and view order details.
- **Authentication:** Register and log in as a buyer.

### For Sellers
- **Seller Dashboard:** Access a dashboard to view sales, revenue, and product statistics.
- **Product Management:** (Extendable) Manage listed products, add new products, and view analytics.
- **Authentication:** Register and log in as a seller.

## Tech Stack
- **Frontend:** React 18, TypeScript
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS, Framer Motion (animations)
- **Build Tool:** Vite
- **Icons:** Lucide React

## Project Structure
```
├── src/
│   ├── components/         # Reusable UI and layout components
│   ├── data/               # Mock data for products, users, reviews
│   ├── lib/                # Utility functions
│   ├── pages/              # Main application pages (Home, Product, Cart, Checkout, Seller Dashboard, etc.)
│   ├── store/              # Zustand stores for auth, cart, products
│   ├── types/              # TypeScript types and interfaces
│   ├── index.css           # Tailwind base styles
│   ├── App.tsx             # Main App component with routing
│   └── main.tsx            # Entry point
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Authentication
- Supports both buyers and sellers.
- Demo uses mock data and localStorage for authentication state.
- Extendable to real backend APIs.

## Customization & Extending
- Add real APIs for authentication, product, and order management.
- Expand seller dashboard features (product CRUD, analytics, etc.).
- Integrate payment gateways and shipping APIs.

## License
This project is for demonstration and educational purposes.

---

*Elite Marketplace — Premium E-commerce Platform*
