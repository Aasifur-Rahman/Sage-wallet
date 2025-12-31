## Sage Wallet

### 🎯 Project Overview

A secure, modular, and role-based backend API for digital wallet system (similar to **Bkash** or **Skrill**) built using **Express** and **mongoose**. This API allows users to manage wallet, perform transactions, and includes role-based access control for admins, users, and agents.

### 🔐 Features

#### Authentication & Authorization

- JWT-based login system
- Secure password hashing using bcrypt
- Role-based route protection

#### Wallet Management

- Automatic wallet creation on registration
- Initial balance: ৳50 for users and agents
- Admin-controlled block/unblock for wallets

#### User Capabilities

- Add money (top-up)
- Withdraw money
- Send Money to other users
- View personal transaction history

#### Admin Capabilities

- View all users, agents, wallets, and transactions
- Block/unblock user wallets
- Approve/suspend agents

#### Transactions

- All transactions are recorded and trackable
- Atomic balance updates with transaction logs
- handles transaction types : deposit/add-money, withdrawal, transfer, cash-in, cash-out

### 📦 API Endpoints

#### Auth

- `POST api/v1/auth/login` – Login and get JWT token
- `POST /api/v1/users/register` – Register user/agent
- `POST /api/v1/auth/change-password`, – Change password user/agent
- `POST /api/v1/auth/forgot-password`, – Forgot password user/agent
- `POST /api/v1/auth/logout` – Logout User/admin/agent

#### Wallet

- `GET /api/v1/wallet/me` – Get your wallet details
- `POST /ap1/v1/wallet/add-money` – Add money
- `POST /api/v1/wallet/withdraw` – Withdraw money
- `GET /api/v1/admin/all` – Admin: View all wallets
- `PATCH /api/v1/admin/block` – Admin: Block wallet
- `PATCH /api/v1/admin/unblock` – Admin: Unblock wallet

#### Transactions

- `GET /api/v1/transactions` – Admin: View all transactions
- `GET /api/v1/transactions/me/transactions` – User/Agent: transaction details
- `POST /api/v1/transactions/send-money` – Send money to other user
- `POST /api/v1/transactions/agent/cash-in` – Agent: Cash-in
- `POST /api/v1/transactions/agent/cash-out` Agent: Cash-out
- `PATCH /api/v1/transactions/admin/approve` Admin: Approving agent
- `PATCH /api/v1/transactions/admin/suspend` Admin: Suspending agent

#### Admin

- `GET /api/v1/wallet` - Admin: View all user/agent wallets
- `GET /api/v1/transactions` – Admin: View all transactions

### 🧠 Business Rules & Validations

- Users cannot withdraw or transfer money if their wallet is blocked
- Agents cannot perform cash-in/out on blocked wallets
- Transactions cannot exceed wallet balance
- Negative amounts are rejected
- Automatic wallet creation with initial balance on registration
- Role-based access control enforced on each route

### 🔧 Tech Stack

- Node.js
- Express js
- Typescript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- dotenv for environment management
- Modular architecture for scalability
