# Feature Specification: Flash Finance Personal Finance Management

**Feature Branch**: `001-personal-finance-management`  
**Created**: 2026-09-14  
**Status**: Draft  
**Input**: User description: "Create a project specification for Flash Finance, a personal finance application where each user manages their own account and can only view their own registered account. Users manage monthly expenses and income through registration and CRUD workflows."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Create and Access a Private Account (Priority: P1)

As an adult managing personal finances, I want to register and sign in to my own account so that my financial information is private and available across sessions.

**Why this priority**: A private account is required before any financial data can be stored safely.

**Independent Test**: Create a new account, sign in with a compliant password, sign out,
and sign in again; verify that the authenticated user can reach their account and an
unauthenticated user cannot reach private data.

**Acceptance Scenarios**:

1. **Given** an unused email address and valid account details, **When** the visitor registers, **Then** a personal account is created and the visitor can sign in.
2. **Given** an existing account and a password of at least 10 characters containing an uppercase letter, a number, and a symbol, **When** the user signs in with valid credentials, **Then** the user reaches only their own account area.
3. **Given** invalid password details, **When** registration or a password change is submitted, **Then** the operation is rejected with a clear validation message.
4. **Given** an existing account, **When** another user or an unauthenticated visitor requests its private data, **Then** the request is denied without revealing the account contents.
5. **Given** three consecutive failed login attempts, **When** the user attempts to log in again within 10 minutes, **Then** the attempt is rejected until the lockout ends.
6. **Given** a user signs in successfully from a new device, **When** authentication completes, **Then** sessions on other devices remain active and the user receives an email notification at the registered address.
7. **Given** an authenticated user, **When** the user logs out, **Then** the current device session is invalidated and cannot be reused.
8. **Given** invalid or duplicate registration details, **When** registration is submitted, **Then** the account is not created and the user receives a clear validation message.

---

### User Story 2 - Record and Manage Income and Expenses (Priority: P1)

As a signed-in user, I want to create, view, update, and delete my income and expense records so that I can understand where my money goes each month.

**Why this priority**: Transaction management is the core value of the application and directly supports monthly financial awareness.

**Independent Test**: With a signed-in account and compatible categories, create an income
and an expense, view and filter them, update one including its type, delete one, and verify
that another account cannot see or modify either record.

**Acceptance Scenarios**:

1. **Given** a signed-in user and a compatible category, **When** the user records an income or expense with an amount greater than $0, at most 2 decimal places, a current or past date, and an optional description of no more than 1,000 characters, **Then** the transaction is saved under that user and appears in their transaction list.
2. **Given** saved transactions, **When** the user queries them with optional type, category, date-range, month, minimum-amount, or maximum-amount filters and pagination, **Then** only that user's matching records are returned in date-descending order.
3. **Given** an existing transaction owned by the user, **When** the user updates valid fields including its type, **Then** the transaction reflects the changes, remains associated with the same user, and uses a category compatible with its final type.
4. **Given** an existing transaction owned by the user, **When** the user deletes it, **Then** it is permanently removed and no longer appears in transaction queries or summaries.
5. **Given** a transaction owned by another user, **When** the current user attempts to view, update, or delete it, **Then** the operation is denied.
6. **Given** an amount of $0, a negative amount, more than 2 decimal places, or a future date, **When** the user submits a transaction, **Then** the transaction is rejected.
7. **Given** a transaction and a category with different types, **When** the user submits or updates the transaction, **Then** the operation is rejected.
8. **Given** a transaction date exactly on the selected start or end date, **When** the user applies a date range filter, **Then** the transaction is included in the results.

---

### User Story 3 - Organize Transactions with Categories (Priority: P2)

As a signed-in user, I want to create and manage income and expense categories so that my transactions are organized around the way I earn and spend money.

**Why this priority**: Categories make transaction records useful for comparison and later financial summaries.

**Independent Test**: Create income and expense categories, assign compatible transactions,
rename and retag an unused category, and verify that a category with transactions cannot be
retagged or deleted or accessed by another user.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** the user creates a category with a name and type of income or expense, **Then** the category is saved for that user.
2. **Given** a category owned by the user, **When** the user assigns a compatible transaction to it, **Then** the transaction uses that category and its income or expense type is consistent with the category.
3. **Given** an unused category owned by the user, **When** the user updates its name or type, or deletes it, **Then** the requested change is applied.
4. **Given** a category with associated transactions, **When** the user attempts to delete it, **Then** deletion is refused and the transactions remain unchanged.
5. **Given** a category owned by another user, **When** the current user attempts to query or modify it, **Then** the operation is denied.
6. **Given** the user owns a category named "food", **When** the user attempts to create " Food " or "FOOD", **Then** creation is rejected as a duplicate because category names are normalized by trimming leading and trailing whitespace and converting the name to lowercase.
7. **Given** a category with associated transactions, **When** the user attempts to change its type, **Then** the change is rejected and the transactions remain unchanged.
8. **Given** a category with associated transactions, **When** the user changes its name to a valid non-duplicate name, **Then** the category name is updated and all associated transactions remain linked to the same category.

---

### User Story 4 - Review Finances and Manage the Account (Priority: P2)

As a signed-in user, I want to review my overall and monthly balances and manage my profile so that I can make informed decisions about my money.

**Why this priority**: Summaries turn individual records into practical insight, while profile controls let users keep their account accurate and secure.

**Independent Test**: Seed one user's income and expenses, verify overall and monthly
balances and category summaries, update the user's name and password, and confirm that
another user's totals and profile remain inaccessible.

**Acceptance Scenarios**:

1. **Given** a user with $2,000 of income and $750 of expenses, **When** the user views their overall summary, **Then** the balance is $1,250 and includes only that user's transactions.
2. **Given** a user with $2,000 of income and $500 of expenses from September 1 through September 30, **When** the user checks the monthly balance for September, **Then** the system displays $2,000 income, $500 expenses, and a $1,500 balance.
3. **Given** categorized transactions, **When** the user views a category summary, **Then** totals are grouped by the user's categories and transaction types.
4. **Given** an authenticated user, **When** the user updates their name or changes their password with valid information, **Then** the account reflects the change and the old password no longer authenticates.
5. **Given** a month with no transactions, **When** the user views its summary, **Then** income, expenses, and balance are each displayed as $0.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- A duplicate email address cannot create a second account.
- Amounts equal to $0, negative amounts, and amounts with more than 2 decimal places are rejected; positive amounts with up to 2 decimal places are accepted.
- A transaction with a future date is rejected, while the current date and past dates are accepted.
- A description longer than 1,000 characters is rejected.
- A transaction cannot reference a missing, incompatible, or another user's category.
- A transaction type can be changed only with a category of the same final type.
- A category with transactions cannot be deleted, even if the category is not currently visible in the user's filtered view.
- A category with transactions cannot change type; an unused category can change type.
- Duplicate category names are rejected for the same user when they differ only by case or other normalized differences.
- Category name normalization removes leading and trailing whitespace (`trim`) and converts the name to lowercase (`lowercase`); " Food ", "food", and "FOOD" are equivalent.
- Empty transaction results and months with no activity display a valid zero-result summary rather than an error.
- A month is a full calendar month; for example, September includes September 1 through September 30.
- Minimum-amount, maximum-amount, combined amount-range, date, month, type, and category filters return only matching transactions. Date range filters are inclusive: `startDate <= transactionDate <= endDate`, so transactions exactly on either boundary are included.
- Pagination returns a valid page for empty, first, middle, and final result sets.
- Transactions are sorted by date descending by default.
- Expired or invalid authentication cannot access private account, category, transaction, or summary data.
- Signing in on another device does not invalidate an existing session on the first device; each device has at most one active session.
- The third consecutive failed login attempt starts a 10-minute lockout, and login attempts during the lockout are rejected. A successful login resets the failed-attempt counter.
- A successful login from a new device keeps other sessions active and sends an email notification.
- Logging out invalidates the current session.
- Repeated authentication or mutation attempts are handled with a user-safe error response and do not disclose whether protected records exist.
- Loading states, no-category states, invalid data, expired sessions, unauthorized access, and internal errors provide clear safe feedback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a visitor to register with an email address and password and MUST reject invalid or already registered email addresses.
- **FR-002**: The system MUST allow a registered user to sign in and sign out with email and password only. Passwords MUST be at least 10 characters and contain at least one uppercase letter, one number, and one symbol.
- **FR-003**: The system MUST lock login attempts for 10 minutes after 3 consecutive failed login attempts, MUST reject attempts made during the lockout, and MUST reset the failed-attempt counter after a successful login.
- **FR-004**: The system MUST allow at most one active session per device. A successful login on another device MUST NOT invalidate existing sessions on other devices, and MUST send an email notification to the registered address when the device is new.
- **FR-005**: The system MUST invalidate and destroy the current session when the user logs out. Password recovery is out of scope for version 1.
- **FR-006**: The system MUST associate each account, session, category, transaction, and financial summary with exactly one user and MUST deny unauthenticated access or access to another user's data.
- **FR-007**: The system MUST allow users to view and update their name, change their password, and log out. Account deletion is out of scope for version 1.
- **FR-008**: The system MUST allow users to create, read, update, and permanently delete their own transactions. Each transaction MUST have exactly one type, either `income` or `expense`, and its type MUST match its category's type.
- **FR-009**: Each transaction amount MUST be greater than $0 and contain no more than 2 decimal places. Transactions MUST use USD, a current or past date, one category, one owning user, and an optional description of no more than 1,000 characters.
- **FR-010**: The system MUST allow users to create, read, update, and delete their own categories. Category updates and deletion MUST comply with the usage restrictions defined in FR-012.
- **FR-011**: The system MUST reject duplicate category names for the same user after normalizing each name by removing leading and trailing whitespace and converting it to lowercase; " Food ", "food", and "FOOD" MUST be treated as the same name.
- **FR-012**: The system MUST allow the name and type of an unused category, meaning a category with no associated transactions, to be changed, and MUST allow an unused category to be deleted. If a category has one or more associated transactions, the system MUST allow its name to be changed, but MUST reject any attempt to change its type or delete it. Existing transactions MUST remain unchanged when a restricted operation is rejected.
- **FR-013**: The system MUST provide an overall balance calculated as total income minus total expenses using only the authenticated user's transactions.
- **FR-014**: The system MUST provide monthly income, monthly expenses, and monthly balance calculated as monthly income minus monthly expenses for the selected full calendar month and user; for example, September runs from September 1 through September 30.
- **FR-015**: The system MUST provide summaries grouped by the authenticated user's categories and transaction types, and MUST return zero income, expenses, and balance for a month with no transactions.
- **FR-016**: The system MUST allow users to filter their own transactions by type, category, date range, month, minimum amount, and maximum amount; minimum and maximum filters MUST work independently and together, and date range filters MUST include transactions where `startDate <= transactionDate <= endDate`.
- **FR-017**: The system MUST paginate transaction results and MUST sort them by date descending by default.
- **FR-018**: The system MUST validate registration, authentication, profile, category, transaction, filter, and password-change inputs and return actionable validation errors.
- **FR-019**: The system MUST use safe error responses and MUST NOT disclose passwords, authentication tokens, or the existence or contents of another user's records.
- **FR-020**: The system MUST provide documented behavior suitable for automated acceptance testing, including loading, empty, invalid-data, expired-session, unauthorized-access, and internal-error states.

### Assumptions

- Version 1 is for individual users; shared accounts and administrative functions are out of scope.
- USD is the sole currency in version 1; Peruvian Soles, other currencies, and multi-currency conversion are out of scope.
- Password recovery and account deletion are out of scope for version 1.
- A transaction has one category, one date, one positive amount, one type, and an optional description; recurring transactions and investment or broker integrations are out of scope.

### Key Entities

- **User Account**: A person's private identity and profile, including email, credentials, and name.
- **Session**: An authenticated session associated with one user and one device; each device has at most one active session, while sessions on other devices remain independent.
- **Category**: A user-owned label with a normalized name and exactly one income or expense type; an unused category can change its name, change type, or be deleted, while a category used by transactions can change its name but cannot change type or be deleted.
- **Transaction**: A user-owned financial record with one category, exactly one income or expense type matching the category, a positive USD amount with at most 2 decimal places, a current or past date, and an optional description of up to 1,000 characters.
- **Financial Summary**: A user-specific view containing overall income, expenses, and balance; monthly income, expenses, and balance; and summaries grouped by category.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of new users can complete registration and reach their private account area in under 3 minutes during acceptance testing.
- **SC-002**: At least 95% of valid transaction create, view, update, and delete actions complete successfully on the first attempt in acceptance testing.
- **SC-003**: 100% of ownership tests prevent a user from viewing or modifying another user's account, categories, transactions, or summaries.
- **SC-004**: At least 90% of acceptance-test users can identify their balance and monthly expenses from the summary without assistance.
- **SC-005**: For a dataset of 1,000 transactions belonging to one user, at least 95% of summary views return within 2 seconds under normal expected usage.
- **SC-006**: 100% of category-deletion attempts involving categories with transactions are refused without deleting or changing those transactions.
- **SC-007**: 100% of attempts to access or modify another user's profile, session, category, transaction, or summary are rejected without revealing protected information.
- **SC-008**: 100% of zero, negative, or more-than-2-decimal-place amounts are rejected.
- **SC-009**: 100% of future-dated transactions are rejected.
- **SC-010**: 100% of duplicate category names for the same user are rejected after trimming leading and trailing whitespace and converting names to lowercase for comparison.
- **SC-011**: 100% of categories with transactions reject both deletion and type changes, while unused categories permit those operations.
- **SC-012**: 100% of overall balances use only the authenticated user's transactions, and 100% of monthly balances use only transactions from the requested full calendar month and user.
- **SC-013**: 100% of login attempts after the third consecutive failure during the 10-minute lockout are rejected.
- **SC-014**: At least 95% of valid filtered and paginated transaction queries return the expected records in date-descending order during acceptance testing.
- **SC-015**: 100% of successful logins reset the consecutive failed-attempt counter.
- **SC-016**: 100% of date-range filter queries include transactions exactly equal to the selected start date or end date.
