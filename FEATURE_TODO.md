# 📝 Feature To-Do List for Elite Marketplace

## 🟢 High Priority
- [ ] **User Profile Management**
  - [x] Mock API Service Layer: Implement a mock API service (using localStorage) for all user/profile/account actions, so features can be tested now and easily integrated with a real backend later. ✅
  - [x] Profile View Page: Display user information (avatar, name, email, address, contact info) ✅
  - [~] Profile Edit Page: Enable persistent profile editing
    - [x] Implement persistent storage logic for profile data (read/write, e.g., localStorage or mock API) ✅
    - [x] Update ProfileEditPage.tsx to load, edit, and save profile fields persistently ✅
    - [x] Update ProfilePage.tsx to fetch and display the latest profile data from storage ✅
    - [x] Ensure state sync between profile view and edit pages ✅

    - [ ] Test: Verify profile changes persist after reload and are reflected across the app (localStorage/mock API)
      - [ ] NOTE: Repeat and expand this test after backend integration to ensure persistence across devices/browsers.
  - [ ] Avatar Upload/Change: Enable users to upload or change their profile picture
  - [~] Password Change: Allow users to change their password securely
    - [x] Add changePassword logic to mock API (localStorage) ✅
    - [x] Add changePassword method to zustand store ✅
    - [x] Create a beautiful password change form (current, new, confirm) ✅
    - [x] Validate current password, new password strength, and match ✅
    - [x] Show user feedback on success or error ✅
    - [x] Test: Password change persists and login works with new password ✅
    - [x] Login, password change, and error handling are now robust and user-friendly.
  - [ ] Backend API Integration: Connect profile management UI to backend APIs for fetching and updating user data
  - [ ] Validation & Feedback: Add form validation and user feedback for profile updates
    - [ ] NOTE: Phone number pattern validation was removed from Profile Edit Page due to browser compatibility issues. Needs robust solution in future.
- [ ] **Order History & Tracking**  
  Let users view past orders, order status, and shipment tracking.
- [ ] **Product Search & Filtering**  
  Implement search bar and advanced filters (category, price, rating, etc.) on the product listing/shop page.
- [ ] **Product Reviews & Ratings**  
  Enable buyers to leave reviews and ratings; display aggregate ratings on product pages.
- [ ] **Seller Product Management**  
  Allow sellers to add, edit, and remove products directly from their dashboard.
- [ ] **Authentication Enhancements**  
  Add password reset, email verification, and possibly OAuth/social login.
- [ ] **Responsive Mobile Design**  
  Ensure all pages are fully responsive and mobile-friendly.

## 🟡 Medium Priority
- [ ] UI/UX Polish
  - Polish profile management (Profile View/Edit) UI/UX to production standards
- [ ] **Wishlist/Favorites**  
  Let users save products to a wishlist or favorites list.
- [ ] **Admin Panel**  
  Create an admin dashboard for managing users, products, orders, and site settings.
- [ ] **Notifications System**  
  Notify users of order updates, promotions, or messages (in-app or via email).
- [ ] **Multi-language Support**  
  Add i18n for global accessibility.
- [ ] **Discount Codes & Promotions**  
  Allow sellers/admins to create discount codes, flash sales, or promotions.

## 🟠 Low Priority
- [ ] **Product Q&A**  
  Allow buyers to ask questions and sellers to answer on product pages.
- [ ] **Blog or Content Section**  
  Add a blog for marketing, news, or guides.
- [ ] **Analytics for Sellers**  
  More advanced analytics (traffic, conversion rates, etc.) in the seller dashboard.
- [ ] **Dark Mode**  
  Add a toggle for light/dark theme.
