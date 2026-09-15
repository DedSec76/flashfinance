Personal Finance Tracker — Project Specification

Project Title
- Personal Finance Tracker

Short Description
- A simple, secure web application to help individuals track income, expenses, and accounts, visualize spending trends, and manage budgets. Built with Next.js (App Router), TypeScript (strict), and Tailwind CSS.

Purpose & Target Audience
- Purpose: Provide an easy-to-use tool for users to record transactions, categorize spending, and view clear reports to make informed financial decisions.
- Target audience: Individuals and freelancers who want a lightweight, privacy-focused finance tracker without heavy accounting features.

MVP Scope (High-level)
- User authentication (email/password + optional magic link)
- Account management (bank/cash accounts)
- Transaction CRUD (create, read, update, delete) with categories and tags
- Monthly summary and basic reports (income vs expense, category breakdown)
- Responsive UI using Tailwind; server-rendered pages by default

User Stories & Acceptance Criteria

1) Sign up / Authentication
- Story: As a new user, I want to sign up so I can save my data securely.
- Acceptance Criteria:
  - User can create an account with email + password.
  - Passwords are hashed server-side; validation enforces minimum length and complexity.
  - After sign-up, user is redirected to the dashboard and a welcome email is queued.
  - Unauthenticated users are redirected to login when accessing protected routes.

2) Add Transaction (Create)
- Story: As a user, I want to add income and expense transactions so I can track money flow.
- Acceptance Criteria:
  - User can create a transaction with date, amount, account, category, description, and optional tags.
  - Transaction shows immediately in the account ledger and totals update.
  - Negative/positive amounts are validated by transaction type (expense vs income).

3) View Transactions (Read)
- Story: As a user, I want to view my transactions so I can inspect and filter them.
- Acceptance Criteria:
  - User can view paginated transactions for an account and across accounts.
  - Filters: date range, category, tag, account, search by description.
  - Transactions list shows date, description, category, amount, and running balance.

4) Edit Transaction (Update)
- Story: As a user, I want to edit a transaction to correct mistakes.
- Acceptance Criteria:
  - User can update any editable field of a transaction.
  - Changes are audited with lastEditedAt timestamp and optional change note.
  - Totals and reports reflect the edited transaction after save.

5) Delete Transaction (Delete)
- Story: As a user, I want to remove transactions I no longer need.
- Acceptance Criteria:
  - User can soft-delete transactions (move to a trash) with a confirmation modal.
  - Soft-deleted transactions can be restored within 30 days; hard delete available to permanently remove.
  - Deletions update account balances and reports.

6) Manage Accounts
- Story: As a user, I want to add and manage accounts (checking, savings, cash) to organize transactions.
- Acceptance Criteria:
  - User can create, rename, and close accounts.
  - Each account has an opening balance and currency.
  - Transactions are associated with an account; account balances compute from transactions.

API Endpoints (REST examples)

Auth
- POST /api/auth/signup
  - Body: { "email": string, "password": string }
  - Success: 201, { "userId": string }
- POST /api/auth/login
  - Body: { "email": string, "password": string }
  - Success: 200, { "token": string }
- POST /api/auth/magic-link
  - Body: { "email": string }

Users
- GET /api/user/me
  - Auth required. Returns user profile.
- PATCH /api/user/me
  - Body: partial profile updates.

Accounts
- GET /api/accounts
  - Returns accounts for current user.
- POST /api/accounts
  - Body: { "name": string, "type": "checking"|"savings"|"cash", "openingBalance": number, "currency": "USD" }
- PATCH /api/accounts/:accountId
- DELETE /api/accounts/:accountId

Transactions
- GET /api/transactions?accountId=&start=&end=&category=&tag=
  - Returns paginated transactions.
- POST /api/transactions
  - Body: { "date": "YYYY-MM-DD", "amount": number, "type": "expense"|"income", "accountId": string, "categoryId": string, "description": string, "tags": string[] }
- GET /api/transactions/:id
- PATCH /api/transactions/:id
- DELETE /api/transactions/:id (soft delete)

Reports
- GET /api/reports/monthly?year=2026&month=9
  - Returns totals, category breakdowns, and simple charts data.
- GET /api/reports/category-trend?start=&end=&categoryId=

Example payload (Create transaction)
{
  "date": "2026-09-14",
  "amount": 45.00,
  "type": "expense",
  "accountId": "acct_123",
  "categoryId": "cat_food",
  "description": "Groceries",
  "tags": ["groceries", "weekly"]
}

Data Model Summary (Core)
- User
  - id: string, email: string, passwordHash: string, createdAt, updatedAt
- Account
  - id, userId, name, type, currency, openingBalance, createdAt
- Category
  - id, userId, name, parentId?, color?
- Transaction
  - id, userId, accountId, date, amount, type, categoryId, description, tags[], createdAt, updatedAt, deletedAt?
- RecurringTransaction (future)
  - id, userId, accountId, amount, cadence, nextDate, active

Implementation Priority / Roadmap
- MVP (Weeks 1–4): Auth, account & transaction CRUD, monthly report, responsive UI, CI with typecheck + unit tests
- Phase 2 (Weeks 5–8): Categories & tags UX, import CSV, recurring transactions, export CSV
- Phase 3 (Weeks 9–12): Budgets, goals, notifications, basic bank import integrations (Plaid-like) if needed

UI & Next.js Patterns
- Use App Router: server components by default; mark components with "use client" only if using state/hooks or browser APIs.
- Route layout: /dashboard, /accounts/[id], /transactions, /reports, /settings
- Data fetching: use server components for initial load, server actions for mutations where appropriate.
- Styling: Tailwind utility classes; small extracted components for repeated patterns.

Testing & CI Requirements
- Type check: `tsc --noEmit` on PRs
- Linting: ESLint + Prettier enforced in pre-commit hooks
- Unit tests: Jest + React Testing Library for UI components and utility functions
- Integration/E2E: Playwright for key flows (sign-up, add transaction, restore transaction, monthly report)
- CI pipeline: run `npm ci`, `npm run typecheck`, `npm test`, `npm run lint`, then run a headless Playwright smoke test

Security & Privacy
- Salted + hashed passwords (bcrypt/argon2)
- JWT or session cookies with SameSite and Secure flags
- No storing of raw bank credentials in MVP; integrate third-party providers securely later
- Data export/import provided as CSV; consider encryption at rest for production

Non-functional Requirements
- Performance: pages render server-side; keep client bundles small. Aim for Lighthouse Performance > 85 for key pages.
- Accessibility: follow WCAG AA standards for forms, colors, and navigation.

Review Checklist (before finalizing spec)
- Title and description match project goals
- User stories cover sign-up and CRUD flows thoroughly
- Acceptance criteria are specific and testable
- API endpoints map to user stories and include payload examples
- Data model fields cover basic requirements for reports and balances
- CI includes typecheck, lint, tests, and at least one smoke e2e

Next Steps
1. Confirm acceptance of this spec or request edits.
2. Save this file to `D:\project-specs\Personal-Finance-Specification.md` and add to your repo.
3. Create tracking issues for MVP user stories and wire up a GitHub Project board.

(End of specification)
