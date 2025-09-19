# 📝 BalanceIQ Roadmap

## 🎯 Project Overview
**BalanceIQ** is a **personal finance web app** where users can:
- Manage **income & expenses**.
- Track **savings goals**.
- View **personalized insights & dashboards**.
- (Bonus) Access SaaS-like features such as reports, alerts, and premium subscriptions.

**Stack:**
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Express (Node.js) + MongoDB
- **Deployment:** Frontend → Vercel | Backend → Render/Railway

---

## 🚀 Development Phases

### **Step 1 → Project Setup**
- Initialize Next.js + Tailwind frontend.
- Initialize Express + MongoDB backend.
- Connect backend API → frontend (test endpoint).

✅ **Goal:** Working base project.

---

### **Step 2 → Authentication (Core Must-Have)**
**Backend:**
- User model → `{ name, email, password, createdAt }`.
- JWT authentication.
- Email OTP verification.
- Forgot/reset password flow.

**Frontend:**
- Pages → Sign Up, Login, OTP Verification, Forgot Password.
- API integration with backend.

✅ **Goal:** Secure user accounts.

---

### **Step 3 → Income & Expense Tracking (Core Must-Have)**
**Backend:**
- Transaction model → `{ userId, type: income|expense, category, amount, date, notes }`.
- CRUD routes → create, list, update, delete transactions.

**Frontend:**
- Transaction form → add income/expense.
- Transaction list (table or cards).
- Edit & delete actions with confirmation.

✅ **Goal:** Core money management.

---

### **Step 4 → Savings Goals (Core Must-Have)**
**Backend:**
- SavingsGoal model → `{ userId, title, targetAmount, currentAmount, deadline }`.
- CRUD routes → create, list, update, delete goals.

**Frontend:**
- Goal form (set title, amount, deadline).
- Progress bar → % of goal achieved.
- Update contributions.

✅ **Goal:** Track savings progress.

---

### **Step 5 → Dashboard & Insights (Core Must-Have)**
**Backend:**
- Aggregation queries:
  - Total income vs expenses.
  - Spending by category.
  - Monthly trends.
  - Savings progress.

**Frontend:**
- Dashboard page with charts:
  - Pie → income vs expenses.
  - Line → monthly spending trend.
  - Bar → category breakdown.
- Insights (e.g., *“You spent 30% more on Food this month”*).

✅ **Goal:** Visualize finances clearly.

---

### **Step 6 → Profile & Settings (Secondary Must-Have)**
- Edit profile info (name, email, password).
- Change password.
- Dark/light mode toggle.

✅ **Goal:** Personalization layer.

---

### **Step 7 → Bonus Features (Optional, Portfolio-Worthy)**
- Budget alerts (warn if overspending).
- Export reports (CSV/PDF).
- Email monthly summary.
- AI insights (*suggested savings strategies*).
- Stripe subscription for premium features.

✅ **Goal:** SaaS-level polish.

---

## 📦 Final Deliverable
- **BalanceIQ** = Personal finance SaaS-style web app.
- Core features: Auth, transactions, savings, insights, dashboard.
- Bonus features: Reports, alerts, payments.
- Deployment: Frontend (Vercel) + Backend (Render/Railway).
- Documentation: Swagger/Postman API docs + README.

---

⚡ **Order of Importance:**
1. Setup
2. Authentication
3. Transactions
4. Savings Goals
5. Dashboard
6. Profile/Settings
7. Bonus Features
