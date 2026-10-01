# FlashFinance — Copilot Instructions

## 1. Project Context

FlashFinance is a personal finance management web application.

Its purpose is to help individual users manage their personal finances by recording income and expenses, organizing transactions into categories, and tracking their financial balance.

### Core Features

* User registration and authentication.
* Personal transaction management (CRUD).
* User-defined income and expense categories.
* Transaction filtering and pagination.
* Financial summaries and balance calculations.
* User profile and session management.

### Technology Stack

* Next.js with the App Router.
* React.
* TypeScript.
* MongoDB for data persistence.
* Zod for input validation.
* Tailwind CSS for utility-based styling.
* Traditional CSS when shared global styles or custom styles are required.

### General Rules

* Use TypeScript for all application code.
* Follow the existing project structure and conventions.
* Use Next.js capabilities instead of introducing an additional backend framework such as Express.
* Use the App Router for application routing.
* Use MongoDB as the project's database.
* Use Zod for input validation.
* Use Tailwind CSS for component-level styling when appropriate.
* Use traditional CSS for global styles or styles that are better represented outside utility classes.
* Do not introduce new dependencies without a clear technical justification.
* Do not implement features outside the agreed project requirements without approval.
* Prefer simple, maintainable solutions over unnecessary abstractions.

---

## 2. Architecture

FlashFinance follows a layered architecture.

For HTTP requests:

```text
Route Handler
    ↓
Validation
    ↓
Service
    ↓
Repository
    ↓
MongoDB
```

For Server Components:

```text
Server Component
    ↓
Service
    ↓
Repository
    ↓
MongoDB
```

Each layer has a specific responsibility.

### Route Handlers

Route Handlers are responsible for HTTP concerns only.

They may:

* Receive HTTP requests.
* Read route parameters.
* Read headers and cookies.
* Parse request bodies.
* Call validation.
* Obtain authentication/session context.
* Call Services.
* Return HTTP responses and status codes.

Route Handlers must not:

* Contain business rules.
* Access MongoDB directly.
* Call Repositories directly.
* Perform complex business logic.
* Replace Services.
* Implement database queries.

### Validation

Validation is responsible for structural and input-level validation.

Use Zod for:

* Required fields.
* Data types.
* String lengths.
* Numeric constraints.
* Enum values.
* Valid identifiers.
* Formatting.
* Optional and nullable values.
* Basic normalization when appropriate.

Validation must not:

* Query MongoDB.
* Check ownership.
* Enforce database-state business rules.
* Replace Service authorization.

### Services

Services contain application and business logic.

Services are responsible for:

* Enforcing business rules.
* Checking ownership.
* Checking relationships between entities.
* Coordinating multiple repositories.
* Deciding whether an operation is allowed.

Services must not:

* Handle HTTP responses.
* Read cookies directly for application logic.
* Access MongoDB directly.
* Contain UI logic.
* Depend on Client Components.

### Repositories

Repositories are the only application layer allowed to access MongoDB directly.

Repositories are responsible for:

* MongoDB queries.
* Creating documents.
* Finding documents.
* Updating documents.
* Deleting documents.
* Counting records.
* Existence checks.
* Database-specific operations.

Repositories must not:

* Contain business rules.
* Perform authorization.
* Handle HTTP.
* Access UI.
* Read cookies.
* Decide whether an application operation is allowed.

### Core Architectural Rules

* No direct MongoDB access outside Repositories.
* Business logic stays in Services.
* Route Handlers remain thin.
* Server Components must not bypass Services and Repositories.
* Client Components never access MongoDB.
* Client Components never import Repositories or database modules.

---

## 3. Next.js App Router

FlashFinance uses the Next.js App Router.

### Server Components

Server Components are the default.

Use Server Components for:

* Server-rendered data.
* Authenticated user data.
* Dashboard data.
* Transactions.
* Financial summaries.
* Server-side calls to Services.

Server Components must not:

* Access MongoDB directly.
* Contain database queries.
* Replace Services.
* Use browser-only APIs.
* Contain unnecessary client state.

Server Components should call Services directly rather than making unnecessary internal HTTP requests such as:

```ts
fetch("/api/...")
```

when the data can be obtained directly through the server-side application layers.

### Client Components

Use Client Components only when client-side behavior is actually required.

Examples:

* Navigation interactions.
* Login and registration forms.
* Create transaction forms.
* Edit transaction forms.
* Delete transaction interactions.
* Create category forms.
* Interactive filters.
* Client-side UI state.
* Browser APIs.
* Event handlers.
* React state.

Do not add:

```ts
"use client";
```

unless it is necessary.

Keep Client Components as small and focused as possible.

Client Components must not:

* Access MongoDB.
* Import Repositories.
* Import database connection modules.
* Contain business rules.
* Implement authentication.
* Implement authorization.

### Route Handlers

Route Handlers belong inside `app/api`.

They should:

1. Receive the request.
2. Parse the input.
3. Validate the input with Zod.
4. Obtain authenticated user/session context.
5. Call the appropriate Service.
6. Translate the result into an HTTP response.

### General Rule

Keep interactive behavior in the smallest possible Client Component.

Avoid turning entire pages into Client Components when only a small part of the page requires client-side behavior.

---

## 4. Validation with Zod

Zod is the standard validation library for FlashFinance.

All external input must be validated before application logic processes it.

### Validation Responsibilities

Zod should validate:

* Required fields.
* Data types.
* String lengths.
* Numeric constraints.
* Enum values.
* Valid identifiers.
* Formatting.
* Optional and nullable values.
* Basic input normalization when appropriate.

Examples:

* Amount must be greater than zero.
* Transaction type must be `"income"` or `"expense"`.
* Description must not exceed 1000 characters.
* Category ID must have a valid format.
* Required fields must be present.

### Validation Files

Organize schemas by domain:

```text
validations/
├── user.validation.ts
├── session.validation.ts
├── category.validation.ts
└── transaction.validation.ts
```

Use separate schemas when create, update, login, and registration operations have different requirements.

### Zod vs Services

Zod handles structural and input-level rules.

Services handle rules that require application context or database state.

Example:

```text
Zod:
    amount > 0
    type is "income" | "expense"
    description <= 1000 characters

Service:
    category exists
    category belongs to user
    transaction type matches category type
    category with transactions cannot be deleted
```

Zod schemas must not:

* Query MongoDB.
* Check ownership.
* Replace authorization.
* Implement database-state business rules.

Server-side validation is always required even if client-side validation exists.

---

## 5. Services and Business Logic

Services contain the application's business logic.

A Service receives validated input and authenticated user identity when required.

Services must:

* Enforce business rules.
* Enforce ownership.
* Validate relationships between entities.
* Coordinate repositories.
* Decide whether an operation is allowed.

### Authentication Context

Authenticated user identity must come from the server-side session.

Never trust a client-provided:

```text
userId
email
status
```

to determine the authenticated user.

### Ownership

The following resources belong to users:

* Sessions.
* Categories.
* Transactions.

Services must ensure that users can only access their own resources.

Prefer ownership-aware Repository methods such as:

```text
findByIdAndUserId(transactionId, userId)
```

instead of:

```text
findById(transactionId)
```

followed by a separate ownership check.

### Business Rules

Services must enforce rules such as:

* A transaction belongs to the authenticated user.
* A category belongs to the authenticated user.
* Transaction type matches category type.
* A category with transactions cannot be deleted.
* A category with transactions cannot change type.
* Transaction amount must be greater than zero.
* Transaction date cannot be in the future.
* Transaction deletion is permanent in V1.
* Category names are unique per user after normalization.
* A category without transactions may be renamed.
* A category without transactions may change type.

Do not expose whether another user's protected resource exists.

If a rule determines whether an operation is allowed, it belongs in the Service.

---

## 6. Repositories and MongoDB

Repositories are the only application layer that directly accesses MongoDB.

### Repository Responsibilities

Repositories may:

* Connect through the project's database layer.
* Query MongoDB collections.
* Create documents.
* Find documents.
* Update documents.
* Delete documents.
* Count documents.
* Perform existence checks.
* Perform database-specific operations.
* Apply required database filters and sorting.

Repositories must not apply application business rules.

### Main Repositories

The main repositories are:

```text
UserRepository
SessionRepository
CategoryRepository
TransactionRepository
```

Prefer explicit Repository methods.

Examples:

```text
findByIdAndUserId()
findByUserId()
create()
update()
delete()
```

Do not create a generic:

```text
BaseRepository<T>
```

unless a concrete requirement justifies it.

### Ownership

Repository queries for user-owned resources should normally include the authenticated user's `userId`.

### MongoDB Isolation

MongoDB-specific implementation details should remain isolated inside the Repository/database layer.

Do not introduce SQL-specific assumptions.

### Required Unique Constraints

The following uniqueness requirements must be respected:

```text
User:
{ email: 1 }

Category:
{ userId: 1, normalizedName: 1 }

Session:
{ userId: 1, deviceId: 1 }
```

Do not create speculative indexes.

Create indexes when they are justified by:

* Uniqueness.
* Required query patterns.
* Filtering.
* Sorting.
* Data integrity.

### MongoDB Types

Use MongoDB-native types appropriately:

```text
_id         → ObjectId
userId      → ObjectId
categoryId  → ObjectId
amount      → Decimal128
dates       → Date
hashes      → string
```

Do not use SQL-specific types such as:

```text
serial
AUTO_INCREMENT
```

Repository queries should filter and process data in MongoDB rather than loading an entire collection and filtering it in application memory.

---

## 7. Authentication, Sessions, and Security

FlashFinance V1 uses email and password authentication.

### V1 Authentication Scope

V1 does not include:

* OAuth/social login.
* Password recovery.
* Account deletion.

### Password Security

Passwords must never be stored in plaintext.

Store only a secure password hash in:

```text
passwordHash
```

Password requirements:

* Minimum 10 characters.
* At least one uppercase letter.
* At least one number.
* At least one special symbol.

Never:

* Log plaintext passwords.
* Return passwords to clients.
* Store plaintext passwords.
* Return password hashes to clients.

### Failed Login Attempts

Users track:

```text
failedLoginAttempts
lockedUntil
```

Initial values:

```text
failedLoginAttempts = 0
lockedUntil = null
```

After three consecutive failed login attempts:

```text
lockedUntil = current time + 10 minutes
```

A successful login resets the failed login counter.

### Sessions

Sessions contain:

```text
userId
deviceId
tokenHash
expiresAt
createdAt
lastUsedAt
```

Session rules:

* Multiple devices may remain logged in simultaneously.
* There is at most one active session per user and device.
* `userId + deviceId` must be unique.
* `deviceId` belongs to the Session, not the User.
* `deviceId` represents browser/device context, not user identity.
* Store `tokenHash`, not the plaintext session token.
* Session validity requires `expiresAt > now`.
* Logout invalidates the current session only.
* Logging in from a new device creates a new session.
* Existing sessions on other devices remain active.
* A configured login notification should be sent for a new-device login.

Do not introduce a new fixed session duration unless explicitly approved by the project requirements.

### Session Validation

To validate a session:

1. Obtain the session token server-side.
2. Hash the received token.
3. Compare it with `tokenHash`.
4. Check that the session has not expired.
5. Obtain the authenticated user.
6. Use that identity for authorization.

Hashes are not decrypted.

### Authentication vs Authorization

Authentication determines who the user is.

Authorization determines whether that authenticated user may perform an operation.

Both must be enforced server-side.

Never rely on UI restrictions as security controls.

### Sensitive Information

Never expose:

* Passwords.
* Password hashes.
* Session tokens.
* Token hashes.
* Authentication secrets.
* Database credentials.
* Internal security information.

Avoid logging sensitive authentication data.

---

## 8. Data Models and MongoDB Conventions

### User

```ts
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  avatar: string | null,
  status: "active" | "inactive",
  failedLoginAttempts: number,
  lockedUntil: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

Rules:

* `email` is unique.
* Passwords are stored only as hashes.
* `failedLoginAttempts` starts at `0`.
* `lockedUntil` starts as `null`.
* `passwordHash` must never be exposed to clients.

### Session

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  deviceId: string,
  tokenHash: string,
  expiresAt: Date,
  createdAt: Date,
  lastUsedAt: Date
}
```

Rules:

* A Session belongs to one User.
* `tokenHash` stores a hash, not a plaintext token.
* Multiple devices can remain active.
* At most one session exists per user/device.
* Session validity depends on `expiresAt`.
* Unique index:

```text
{ userId: 1, deviceId: 1 }
```

### Category

```ts
{
  _id: ObjectId,
  name: string,
  normalizedName: string,
  type: "income" | "expense",
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

Rules:

* A Category belongs to one User.
* Category names are unique per user using `normalizedName`.
* `type` must be `"income"` or `"expense"`.
* Categories are user-created.
* A category with transactions cannot be deleted.
* A category with transactions cannot change type.
* Unique index:

```text
{ userId: 1, normalizedName: 1 }
```

### Transaction

```ts
{
  _id: ObjectId,
  title: string,
  amount: Decimal128,
  type: "income" | "expense",
  categoryId: ObjectId,
  description: string | null,
  date: Date,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

Rules:

* A Transaction belongs to one User.
* A Transaction belongs to one Category.
* `amount` must be greater than zero.
* Monetary values use `Decimal128`.
* Amounts allow a maximum of two decimal places.
* `type` must be `"income"` or `"expense"`.
* Transaction type must match the Category type.
* Transaction date cannot be in the future.
* Description is optional.
* Description has a maximum length of 1000 characters.
* Transaction date is not unique.
* Multiple transactions may share the same date.
* Transaction deletion is permanent in V1.

### Relationships

```text
User 1:N Session
User 1:N Category
User 1:N Transaction
Category 1:N Transaction
```

### Controlled Denormalization

`Transaction.type` may be stored even though `Category` also contains a `type`.

This is controlled denormalization.

The Service must enforce:

```text
Transaction.type === Category.type
```

The duplicated field must never become an independent source of truth.

---

## 9. TypeScript and Code Conventions

FlashFinance uses TypeScript throughout the application.

Code should prioritize type safety, readability, maintainability, and explicit domain modeling.

### Type Safety

* Use explicit domain types when they improve clarity.
* Prefer inferred types when TypeScript can safely infer them.
* Avoid `any`.
* Do not use `any` to bypass TypeScript errors.
* Use `unknown` when the type of external data is not known.
* Narrow unknown values before using them.
* Avoid unnecessary type assertions.
* Do not use `as` to hide incorrect types.
* Keep types aligned with the domain model.

### Domain Types

Use explicit types for important domain concepts.

Examples:

```ts
type TransactionType = "income" | "expense";

type UserStatus = "active" | "inactive";
```

Prefer domain types over repeated unrestricted strings.

### Interfaces and Types

Use `type` or `interface` according to the purpose of the definition.

Prefer simple and readable definitions over unnecessary type abstractions.

Do not create generic types solely to make code appear more sophisticated.

### Function Design

Functions should have a single clear responsibility.

Prefer:

* Small functions.
* Explicit parameters.
* Explicit return types for important application boundaries.
* Descriptive names.
* Predictable behavior.

Avoid:

* Large functions with multiple responsibilities.
* Functions that mix HTTP, business logic, and database access.
* Hidden side effects.
* Deeply nested conditional logic when simpler control flow is possible.

### Naming

Use:

* `camelCase` for variables and functions.
* `PascalCase` for types, interfaces, classes, and React components.
* `UPPER_SNAKE_CASE` only for true constants when appropriate.

### Nullability

Model nullable values explicitly.

Examples:

```ts
avatar: string | null;
lockedUntil: Date | null;
description: string | null;
```

Do not use empty strings as substitutes for nullable domain values unless the domain explicitly requires it.

### Error Handling

Do not silently ignore errors.

Handle errors at the appropriate application layer.

Do not expose internal errors, database details, stack traces, or sensitive implementation information to clients.

### Async Code

Use `async/await` for asynchronous operations.

Handle rejected promises.

Avoid unnecessary promise chains.

### Imports

Keep imports organized.

Remove unused imports.

Prefer existing project path aliases.

Do not introduce new alias/path conventions without following the project configuration.

### Code Quality

Before considering a change complete:

* TypeScript compiles without errors.
* No unused variables or imports remain.
* No temporary debugging statements remain.
* No commented-out experimental code remains.
* Existing project conventions are followed.
* Code favors readability over cleverness.

---

## 10. Project Structure and Naming

FlashFinance should follow a clear and predictable project structure that reflects the application architecture.

### Recommended Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── categories/
│   │   └── transactions/
│   │
│   └── ...
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── auth/
│   ├── categories/
│   └── transactions/
│
├── services/
│   ├── auth/
│   ├── category/
│   ├── transaction/
│   └── user/
│
├── repositories/
│   ├── user.repository.ts
│   ├── session.repository.ts
│   ├── category.repository.ts
│   └── transaction.repository.ts
│
├── validations/
│   ├── user.validation.ts
│   ├── session.validation.ts
│   ├── category.validation.ts
│   └── transaction.validation.ts
│
├── lib/
│   ├── mongodb/
│   ├── auth/
│   └── ...
│
├── types/
│   └── ...
│
└── ...
```

The exact structure may evolve as the application grows.

New folders must have a clear architectural purpose.

### App Router Organization

Use `app/` for Next.js routes and pages.

* Pages belong to the App Router.
* Route Handlers belong inside `app/api`.
* Route Handlers should remain thin.
* UI components should not contain Repository logic.
* Server Components should call Services directly when server-side data is required.

### Components

Reusable React components belong under `components/`.

Organize components by responsibility or domain when useful.

Examples:

```text
components/
├── ui/
├── auth/
├── categories/
└── transactions/
```

Avoid placing business logic inside components.

### Services

Services should be organized by domain.

Examples:

```text
services/
├── auth/
├── category/
├── transaction/
└── user/
```

Service files should use descriptive names such as:

```text
auth.service.ts
category.service.ts
transaction.service.ts
```

### Repositories

Repositories should use explicit entity-based names.

Examples:

```text
user.repository.ts
session.repository.ts
category.repository.ts
transaction.repository.ts
```

Avoid vague names such as:

```text
database.ts
data.ts
repository.ts
```

when they hide the entity being accessed.

### Validation Files

Validation schemas should be organized by domain.

Examples:

```text
user.validation.ts
session.validation.ts
category.validation.ts
transaction.validation.ts
```

### Naming Conventions

Use descriptive and predictable names.

* Folders: lowercase and descriptive.
* React components: PascalCase.
* Services: `<domain>.service.ts`.
* Repositories: `<domain>.repository.ts`.
* Validation files: `<domain>.validation.ts`.

Avoid vague names such as:

```text
helpers.ts
utils.ts
common.ts
```

unless their purpose is genuinely shared and clear.

### Separation of Responsibilities

Follow these boundaries:

```text
app/            → Next.js routing and pages
components/     → UI
validations/    → Input schemas
services/       → Business logic
repositories/   → MongoDB access
lib/            → Infrastructure/shared server utilities
types/          → Shared TypeScript/domain types
```

A file should have one primary architectural responsibility.

### Avoid Unnecessary Abstractions

Do not create folders, layers, classes, utilities, or abstractions without a concrete reason.

Prefer a simple structure that makes the application easy to understand.

Do not reorganize the project solely to introduce a different architecture unless the change is explicitly required.

---

## 11. API, HTTP Responses and Error Handling

FlashFinance uses Next.js Route Handlers for HTTP API endpoints.

Route Handlers must remain thin and delegate validation, business logic, and database access to the appropriate layers.

### Route Handler Responsibilities

Route Handlers are responsible for:

* Receiving HTTP requests.
* Reading route parameters.
* Reading cookies or authentication information.
* Parsing request bodies.
* Calling Zod validation.
* Obtaining authenticated user/session context.
* Calling the appropriate Service.
* Returning appropriate HTTP responses.

Route Handlers must not:

* Contain business rules.
* Access MongoDB directly.
* Call Repositories directly.
* Perform complex business transformations.
* Implement authorization rules.
* Trust client-provided `userId` or protected identity information.

### Request Flow

```text
HTTP Request
    ↓
Route Handler
    ↓
Parse Input
    ↓
Zod Validation
    ↓
Authentication / Session Context
    ↓
Service
    ↓
Repository
    ↓
MongoDB
    ↓
Service Result
    ↓
HTTP Response
```

### HTTP Methods

Use:

* `GET` → retrieve resources.
* `POST` → create resources.
* `PATCH` → partially update resources.
* `DELETE` → delete resources.

Do not use `POST` for every operation when another HTTP method correctly represents the operation.

### Common Status Codes

#### `200 OK`

Use when a request succeeds and returns a resource or result.

Examples:

* Retrieve transactions.
* Retrieve categories.
* Update a transaction.
* Delete a resource when returning a successful result.

#### `201 Created`

Use when a new resource is successfully created.

Examples:

* Register a user.
* Create a category.
* Create a transaction.
* Create a session.

#### `204 No Content`

Use when an operation succeeds and no response body is required.

Example:

* Successful deletion when no response data is necessary.

#### `400 Bad Request`

Use when the request cannot be processed because the input or request format is invalid.

Examples:

* Malformed request body.
* Invalid request parameters.
* Invalid input that reaches the API outside the expected validation flow.

#### `401 Unauthorized`

Use when authentication is required but the request does not contain a valid authenticated session.

Examples:

* Missing session.
* Invalid session.
* Expired session.

#### `403 Forbidden`

Use when an authenticated user is not allowed to perform an operation.

Use this only when the application intentionally distinguishes authentication from authorization.

#### `404 Not Found`

Use when the requested resource does not exist or should not be exposed to the requesting user.

Do not reveal whether another user's protected resource exists.

#### `409 Conflict`

Use when the requested operation conflicts with an existing resource or database constraint.

Examples:

* Duplicate user email.
* Duplicate category name for the same user.
* Attempt to create a resource that violates a uniqueness rule.

#### `422 Unprocessable Entity`

Use when the request is syntactically valid but fails application-level validation when a distinction from `400` is useful.

Do not use `422` inconsistently. Follow the project's established convention once one is chosen.

#### `500 Internal Server Error`

Use for unexpected server-side failures.

Do not expose:

* Stack traces.
* MongoDB errors.
* Database connection details.
* Internal implementation details.
* Authentication secrets.

### Error Handling

Expected application errors should be handled deliberately.

Services should communicate expected business failures consistently so Route Handlers can translate them into appropriate HTTP responses.

Avoid using raw database errors as API responses.

Do not expose internal error messages directly to clients.

### Error Response Shape

API errors should use a consistent structure.

Example:

```ts
{
  error: {
    code: "CATEGORY_NOT_FOUND",
    message: "Category not found."
  }
}
```

Validation errors may include structured field information:

```ts
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid request data.",
    fields: {
      name: "Category name is required."
    }
  }
}
```

Do not expose sensitive implementation details through the `message` field.

### Business Errors

Business rules belong to Services.

Examples:

```text
CATEGORY_NOT_FOUND
CATEGORY_ALREADY_EXISTS
CATEGORY_HAS_TRANSACTIONS
CATEGORY_TYPE_MISMATCH
TRANSACTION_NOT_FOUND
TRANSACTION_TYPE_MISMATCH
SESSION_INVALID
SESSION_EXPIRED
ACCOUNT_LOCKED
```

These errors should be translated into HTTP responses by the appropriate higher-level layer.

### Logging

Unexpected server errors may be logged server-side when appropriate.

Never log:

* Passwords.
* Password hashes.
* Session tokens.
* Token hashes.
* Authentication secrets.
* Database credentials.

Client responses should contain only information necessary for the client to handle the error.

### Consistency

All Route Handlers should follow the same general conventions.

When adding a new endpoint:

1. Define the expected HTTP method.
2. Define and validate its input.
3. Obtain authentication context when required.
4. Call the appropriate Service.
5. Translate expected errors into HTTP responses.
6. Return a consistent response shape.
7. Avoid exposing internal implementation details.

---

## 12. UI, Styling and Components

FlashFinance uses React components with Tailwind CSS and traditional CSS when appropriate.

The UI should prioritize consistency, accessibility, maintainability, and clear separation between presentation and application logic.

### Server and Client Components

Use Server Components by default.

Use Client Components only when client-side behavior is required.

Client Components are appropriate for:

* Interactive forms.
* Event handlers.
* React state.
* Interactive filters.
* Client-side UI state.
* Browser APIs.
* Navigation interactions that require client-side behavior.
* Create, edit, and delete interactions that require client state.

Do not add `"use client"` unless it is necessary.

Prefer keeping Client Components small and focused.

### Component Responsibilities

Components should primarily handle presentation and user interaction.

Components must not:

* Access MongoDB.
* Import Repositories.
* Contain database queries.
* Contain business rules.
* Perform authorization.
* Implement authentication logic.
* Duplicate Service logic.

Business rules belong in Services.

### Reusable Components

Create reusable components when the same UI behavior or visual pattern is used in multiple places.

Examples:

```text
Button
Input
Modal
FormField
Card
Table
Pagination
LoadingState
ErrorMessage
```

Do not create reusable components solely because a piece of markup appears once.

Avoid excessive component fragmentation.

### Domain Components

Domain-specific UI may be grouped by feature.

Examples:

```text
components/
├── auth/
├── categories/
├── transactions/
└── navigation/
```

Examples:

```text
TransactionForm
TransactionTable
TransactionFilters
CategoryForm
CategoryList
LoginForm
RegisterForm
```

Domain components should remain focused on UI and interaction.

### Tailwind CSS

Use Tailwind CSS for component-level styling and layout.

Prefer existing Tailwind utilities over custom CSS when the utility classes clearly express the intended style.

Avoid unnecessarily long or repetitive class lists when a reusable component or shared style would make the code clearer.

Do not introduce arbitrary values when an existing Tailwind utility provides an appropriate solution.

### Traditional CSS

Use traditional CSS when it provides a clearer solution.

Appropriate uses include:

* Global styles.
* CSS variables.
* Application-wide design tokens.
* Complex custom styles.
* Styles that are difficult to express clearly with utilities.

Do not create separate CSS files for every small component when Tailwind utilities are sufficient.

### Design Consistency

Maintain consistency in:

* Typography.
* Spacing.
* Border radius.
* Buttons.
* Form controls.
* Colors.
* Cards.
* Tables.
* Feedback states.
* Responsive behavior.

Prefer existing project design decisions over introducing new visual patterns.

### Accessibility

UI components should follow basic accessibility practices.

* Use semantic HTML when appropriate.
* Form controls should have accessible labels.
* Buttons should clearly describe their action.
* Images should have meaningful `alt` text when necessary.
* Interactive elements must be keyboard accessible.
* Do not use color as the only way to communicate important information.
* Provide visible feedback for validation and important errors.

### Forms

Forms should clearly communicate:

* Required fields.
* Validation errors.
* Loading/submission states.
* Successful operations when appropriate.
* Failed operations.

Client-side validation may improve user experience but does not replace server-side Zod validation.

### Responsive Design

The application should work across common desktop and mobile screen sizes.

Prefer responsive layouts using Tailwind's responsive utilities.

Do not assume a fixed desktop-only viewport.

### Loading and Error States

Interactive and data-driven UI should provide appropriate feedback when operations are:

* Loading.
* Successful.
* Failed.
* Empty.

Avoid leaving users without feedback during operations that may take noticeable time.

### UI and Business Logic Separation

UI components determine how information is displayed, but they must not determine whether a business operation is allowed.

Example:

```text
UI:
"Show delete button."

Service:
"Determine whether this transaction can be deleted."
```

Client-side UI restrictions improve user experience but are never considered security controls.

---

## 13. Testing and Quality

FlashFinance should maintain a reasonable level of automated testing focused on business-critical behavior.

Tests should provide confidence that important application rules continue to work as the project evolves.

### Testing Principles

* Test behavior and requirements rather than implementation details.
* Prioritize business rules and critical application flows.
* Keep tests readable and maintainable.
* Avoid tests that depend unnecessarily on internal implementation.
* Do not add tests solely to increase coverage numbers.

### Service Testing

Services should be the primary target for business logic tests.

Test important rules such as:

* Transaction ownership.
* Category ownership.
* Transaction type matching category type.
* Category uniqueness.
* Category deletion restrictions.
* Category type-change restrictions.
* Transaction amount validation.
* Transaction date restrictions.
* Session validation.
* Authentication and account lockout rules.

Services should be testable without requiring UI components.

### Repository Testing

Repository tests should verify important database behavior when appropriate.

Examples:

* Creating records.
* Finding records by authenticated user.
* Updating records.
* Deleting records.
* Uniqueness constraints.
* Queries involving required filters or sorting.

Do not duplicate every Service test at the Repository level.

Repositories are responsible for database access, not business rules.

### Validation Testing

Zod schemas should be tested when validation rules are complex or business-critical.

Examples:

* Required fields.
* Invalid data types.
* Invalid enum values.
* String length restrictions.
* Numeric restrictions.
* Invalid identifiers.
* Invalid date formats.

Simple schemas do not require excessive test cases.

### Route Handler Testing

Route Handlers should be tested when their HTTP behavior is important or complex.

Examples:

* Correct HTTP status codes.
* Authentication requirements.
* Validation failures.
* Successful responses.
* Expected business errors.
* Unexpected server errors.

Do not duplicate all Service tests inside Route Handler tests.

### Authentication Testing

Authentication and session behavior should receive particular attention.

Test cases should include:

* Successful registration.
* Invalid registration input.
* Successful login.
* Invalid credentials.
* Account lockout after three consecutive failed attempts.
* Login after the lockout period.
* Session creation.
* Session validation.
* Expired sessions.
* Logout.
* Multiple device sessions.
* Invalid or unknown session tokens.

Never use real passwords, production credentials, or real authentication secrets in tests.

### Test Isolation

Tests should be independent and reproducible.

Avoid relying on:

* Test execution order.
* Existing production data.
* Developer-specific local data.
* External services unless explicitly required.

Test data should be controlled by the test environment.

### Edge Cases

Important edge cases should be considered explicitly.

Examples:

* Empty transaction lists.
* Empty months with zero financial totals.
* Duplicate category names with different casing.
* Multiple transactions on the same date.
* Invalid or missing category IDs.
* Access to another user's resources.
* Expired sessions.
* Boundary values for validation rules.

### Quality Checks

Before considering a feature complete:

* TypeScript compiles without errors.
* Relevant tests pass.
* Zod validation is present where required.
* Business rules are enforced in Services.
* Database access remains inside Repositories.
* Authentication and ownership checks are enforced server-side.
* No sensitive information is exposed.
* No temporary debugging code remains.
* The feature follows the established project architecture.

### Test Scope

Do not require every UI component to have a dedicated test.

Prioritize testing according to risk and importance.

Critical business logic should have stronger test coverage than simple presentational components.

---

## 14. Git, Branches, Commits and Pull Requests

FlashFinance is developed collaboratively using Git and GitHub.

Changes should be organized into small, focused units that are easy to review and understand.

### Branches

Use feature branches for new functionality or significant changes.

Examples:

```text
feature/create-transaction
feature/category-management
feature/authentication
fix/transaction-validation
fix/session-expiration
```

Avoid vague branch names such as:

```text
test
changes
update
new
stuff
```

Do not work directly on the main branch for feature development unless the project's workflow explicitly requires it.

### Commits

Commits should represent a clear and logical change.

Prefer small, focused commits over large commits containing unrelated changes.

Use descriptive commit messages.

Examples:

```text
feat: add transaction creation service
feat: add category validation
fix: prevent future transaction dates
fix: validate session expiration
refactor: simplify transaction repository
test: add category ownership tests
```

Use conventional prefixes when appropriate:

* `feat:` — new functionality.
* `fix:` — bug fix.
* `refactor:` — code restructuring without changing behavior.
* `test:` — tests.
* `docs:` — documentation.
* `chore:` — maintenance or configuration.

Avoid meaningless commit messages such as:

```text
update
changes
fix
stuff
final
final-final
```

### Pull Requests

Pull Requests should contain a focused set of related changes.

A Pull Request should explain:

* What was changed.
* Why the change was needed.
* Important implementation details when relevant.
* How the change was tested.

Avoid combining unrelated features or refactors in the same Pull Request.

### Code Review

Code should be reviewed before being merged when the team workflow requires Pull Requests.

Reviewers should verify:

* The feature follows the established architecture.
* Business logic is in Services.
* Database access is in Repositories.
* Input validation uses Zod where required.
* Authentication and ownership are enforced server-side.
* No sensitive information is exposed.
* Tests or relevant quality checks are present.
* The change does not introduce unnecessary dependencies or architectural complexity.

### Scope Control

Keep changes focused on the requested task.

Do not modify unrelated files merely because they could be improved.

Avoid unrelated refactoring while implementing a feature unless the refactoring is necessary for the requested change.

If an unrelated issue is discovered, document it separately rather than silently expanding the scope.

### Copilot and Git

Copilot-generated code must be reviewed before committing.

Do not automatically accept generated code without understanding its purpose and verifying that it follows the project's architecture.

Before committing Copilot-generated changes:

1. Review the changed files.
2. Verify the architectural layer of each change.
3. Check validation and business rules.
4. Check authentication and authorization behavior.
5. Run relevant tests and quality checks.
6. Remove unnecessary generated code.
7. Commit only the intended changes.

---

## 15. Definition of Done and General Development Rules

Every feature or change should follow the established FlashFinance architecture and project requirements.

A task should not be considered complete simply because the code compiles or the UI appears to work.

### General Development Rules

Before implementing a feature:

1. Understand the existing project structure.
2. Identify the appropriate architectural layer.
3. Check the existing domain models and business rules.
4. Reuse existing utilities, components, Services, Repositories, and validations when appropriate.
5. Avoid introducing unnecessary dependencies or abstractions.

### Architectural Verification

Before considering a change complete, verify:

* UI logic is inside appropriate React components.
* Server-side data access follows the Service → Repository flow.
* Route Handlers remain focused on HTTP concerns.
* Business rules are implemented in Services.
* MongoDB access is implemented only in Repositories.
* Input validation is implemented with Zod where required.
* Client Components do not access MongoDB or server-only modules.
* Server Components do not bypass Services and Repositories.
* Authentication and authorization remain server-side.

### Security Verification

Verify that:

* Passwords are never stored or logged in plaintext.
* Password hashes are never returned to clients.
* Session tokens and token hashes are not exposed.
* Authentication secrets are not exposed.
* Client-provided `userId` values are not trusted.
* User-owned resources are scoped to the authenticated user.
* Authorization is enforced server-side.
* Internal database or infrastructure errors are not exposed.
* Sensitive information is not included in logs or API responses.

### Validation Verification

Verify that:

* External input is validated before application logic.
* Zod schemas match the expected input structure.
* Business rules remain in Services.
* Validation is performed server-side even when client-side validation exists.
* Create and update operations use appropriate schemas when their requirements differ.

### Data Access Verification

Verify that:

* MongoDB access occurs only through Repositories.
* Repository queries correctly scope user-owned resources.
* Required unique constraints are respected.
* MongoDB types are used correctly.
* Dates use MongoDB `Date`.
* Monetary values use `Decimal128`.
* Object references use `ObjectId`.
* No speculative database indexes are introduced.

### TypeScript Verification

Before completing a change:

* TypeScript has no compilation errors.
* `any` is not introduced unnecessarily.
* Types accurately represent domain data.
* Nullable values are represented explicitly.
* Unused imports and variables are removed.
* Unnecessary type assertions are avoided.

### Testing Verification

Before completing a change:

* Relevant automated tests pass.
* Important business rules are covered where appropriate.
* Authentication and ownership behavior are verified when affected.
* Edge cases are considered.
* Tests do not depend on production data or developer-specific state.

### UI Verification

For UI changes, verify:

* Server Components remain the default.
* Client Components are used only when required.
* Components do not contain business rules.
* Forms provide appropriate validation feedback.
* Loading and error states are handled where necessary.
* UI is responsive.
* Basic accessibility requirements are respected.
* Existing design patterns are reused when appropriate.

### Scope Verification

Before finalizing a task:

* Only required files were changed.
* No unrelated refactoring was introduced.
* No unnecessary dependencies were added.
* No temporary debugging code remains.
* No commented-out experimental code remains.
* Existing functionality was not unnecessarily broken.

### Copilot Behavior

When generating or modifying code:

* Follow these instructions before generating implementation.
* Prefer existing project patterns over inventing new ones.
* Ask for clarification when requirements conflict with the established architecture.
* Do not silently change approved domain rules.
* Do not introduce new architectural layers without justification.
* Do not implement features outside the agreed requirements.
* Explain important architectural decisions when they are not obvious.
* Generated code must be reviewed by a developer before it is considered complete.

### Definition of Done

A feature is considered complete when:

* The requested behavior is implemented.
* The implementation follows the established architecture.
* Input validation is present where required.
* Business rules are enforced server-side.
* Authentication and authorization are correctly enforced.
* Database access follows the Repository pattern.
* TypeScript passes without errors.
* Relevant tests pass.
* UI behavior is functional and accessible when applicable.
* No sensitive information is exposed.
* No unnecessary code or dependencies were introduced.
* The implementation is ready for code review.