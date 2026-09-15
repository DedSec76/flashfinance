<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles: II. Explicit, Typed Domain Contracts; III. Secure Authentication and
	Session Lifecycle; IV. Financial Integrity and Safe Mutations; V. Testable Delivery;
	VI. Observable, Documented Operations
- Added sections: explicit full-stack Next.js architecture and v1 authentication scope
- Removed sections: Express-specific API assumptions; mandatory OAuth providers; global
	one-session limit; Swagger-specific documentation requirement
- Templates requiring updates: .specify/templates/plan-template.md (updated);
	.specify/templates/tasks-template.md (updated)
- Templates requiring no update: .specify/templates/spec-template.md (compatible)
- Runtime/specification guidance requiring updates: specs/001-personal-finance-management/spec.md
- Command files: none present under .specify/templates/commands/
- Deferred items: TODO(RATIFICATION_DATE) remains because the original adoption date is unknown
-->

# FlashFinance Constitution

## Core Principles

### I. Secure User-Owned Finance Data
Every authenticated operation MUST enforce resource ownership. Transactions, categories,
profiles, sessions, and statistics MUST be scoped to the authenticated user, and account
deletion MUST remove or irreversibly detach that user's data according to the feature
requirements. Authorization checks MUST occur server-side; client visibility is never a
security boundary. This protects the confidentiality and integrity of personal financial data.

### II. Explicit, Typed Domain Contracts
The application MUST use TypeScript strict mode and MUST NOT use `any`. Boundary inputs,
including forms, route-handler or server-action inputs, query parameters, and environment
variables, MUST be validated with Zod before use. Domain types MUST make income versus
expense, category ownership, transaction ownership, and session state explicit. This keeps
financial calculations and authorization decisions reviewable and predictable.

### III. Secure Authentication and Session Lifecycle
Version 1 MUST support email/password registration and sign-in only; Google OAuth and GitHub
OAuth are out of scope. Passwords MUST be hashed with bcrypt and MUST never be stored in
plaintext. Authentication credentials or tokens MUST be validated server-side. A user MAY
have one active session per device, and signing in on another device MUST NOT invalidate
sessions on other devices. Next.js middleware, route handlers, server actions, and server
components MUST enforce private-route and mutation authorization as appropriate. Rate
limiting MUST protect abuse-prone endpoints, and deployment security headers and cross-origin
behavior MUST be configured deliberately for each environment.

### IV. Financial Integrity and Safe Mutations
Each transaction MUST belong to exactly one user and one category and MUST have exactly one
type: `income` or `expense`. Each category MUST have exactly one type: `income` or `expense`.
A transaction's type MUST equal its category's type; mismatches MUST be rejected during
creation and update. Categories with associated transactions MUST NOT be deleted.
Transaction deletion is a deliberate hard delete, while all create, update, query, and
delete paths MUST validate input and ownership before mutation. Balance, monthly expense,
and category summary calculations MUST use a single documented source of truth.

### V. Testable Delivery
User-visible behavior and security-sensitive behavior MUST be covered by automated tests.
Tests MUST cover Next.js route handlers, server actions, server-side authorization, and
relevant client behavior using the repository's selected test tools. Coverage MUST include
authentication, authorization, ownership failures, validation failures, per-device session
behavior, category rules, transaction type consistency, transaction mutations, and
statistics. Tests MUST be deterministic and runnable in CI. Features MUST be independently
verifiable by user story, with tests added alongside the implementation rather than deferred
to a final hardening pass.

### VI. Observable, Documented Operations
Next.js route handlers, server actions, and server-rendered operations MUST return consistent
safe errors without leaking secrets or implementation details. Security-relevant and
mutation operations MUST be logged with useful structured context while excluding passwords,
tokens, and sensitive financial payloads. User-visible routes, server actions, deployment
configuration, required environment variables, and operational assumptions MUST be
documented close to the code. Simplicity is preferred: new abstractions require a clear
reduction in duplication or risk.

## Technology and Security Constraints

FlashFinance is a full-stack web application and MUST use Next.js with the App Router,
React, TypeScript, Tailwind CSS, MongoDB, and Zod. Backend functionality MUST follow Next.js
conventions through server components, route handlers, server actions, and other appropriate
server-side modules; an Express-specific architecture MUST NOT be imposed. Server Components
MUST be the default, Client Components MUST be limited to interactive or browser-only
behavior, and routes MUST follow Next.js file-based routing conventions. Tailwind utility
classes MUST be the default styling approach; custom CSS is permitted only when a utility or
existing component convention cannot express the required behavior.

The application MUST use Zod validation, bcrypt password hashing, a server-validated session
mechanism, rate limiting where abuse risk warrants it, deployment-appropriate security
headers and cross-origin controls, and resource-ownership checks. Secrets MUST come from
environment configuration and MUST NOT be committed to the repository.

## Development Workflow and Quality Gates

Every feature MUST identify its user stories, acceptance scenarios, data ownership rules,
validation boundaries, and test strategy before implementation. Pull requests MUST pass
formatting, linting, strict type checking, relevant tests, and a production build before
merge. Reviews MUST check the Constitution Check in the implementation plan, server/client
boundaries, authorization on every private mutation, and the absence of secret or token
leakage. Route, server-action, deployment, and environment documentation MUST be updated
when public behavior or operational requirements change.

Team members MUST use descriptive names, consistent casing, small focused modules, and
workspace formatting conventions. Commits and pull requests MUST describe the user-visible
or operational impact of the change. Generated files and unrelated refactors MUST NOT obscure
the behavior under review.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes conflicting project guidance. Amendments MUST document the
reason for change, affected principles, migration or compatibility impact, and required
template or documentation updates. At least one reviewer MUST verify compliance before an
amendment is merged. Feature plans MUST include a Constitution Check before research and
again after design; any violation MUST be recorded in Complexity Tracking with a simpler
alternative and the reason it was rejected.

The version follows semantic versioning for governance: MAJOR for incompatible principle
removals or redefinitions, MINOR for new principles or materially expanded obligations, and
PATCH for clarifications or non-semantic corrections. Compliance is reviewed at each pull
request, release, and security-sensitive change. The latest constitution is the source of
truth; dependent templates and runtime guidance MUST be synchronized in the same change.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-09-15
