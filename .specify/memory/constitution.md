<!--
Sync Impact Report
- Version change: template -> 1.0.0 (initial adoption)
- Modified principles: template placeholders replaced with six application principles
- Added sections: Technology and Security Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Templates requiring updates: .specify/templates/plan-template.md (updated); .specify/templates/tasks-template.md (updated)
- Templates requiring no update: .specify/templates/spec-template.md (compatible)
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
including forms, API payloads, query parameters, OAuth responses, and environment variables,
MUST be validated with Zod or an equivalent typed adapter before use. Domain types MUST make
income versus expense, category ownership, transaction ownership, and session state explicit.
This keeps financial calculations and authorization decisions reviewable and predictable.

### III. Secure Authentication and Session Lifecycle
The system MUST support email/password registration and GitHub or Google OAuth. Passwords
MUST be hashed with bcrypt and MUST never be stored in plaintext. JWT access tokens and
refresh tokens MUST be validated server-side; persisted refresh tokens MUST be represented
by `tokenHash`. A user MUST have at most one active session. Authentication middleware MUST
protect private routes, rate limiting MUST protect abuse-prone endpoints, and Helmet and
CORS MUST be configured deliberately for each deployment environment.

### IV. Financial Integrity and Safe Mutations
Each transaction MUST belong to exactly one user and one category. A transaction's `type`
MUST be derived from its category and stored only as controlled denormalization. Categories
MUST be typed as `income` or `expense`; categories with associated transactions MUST NOT be
deleted. Transaction deletion is a deliberate hard delete, while all create, update, query,
and delete paths MUST validate input and ownership before mutation. Balance, monthly expense,
and category summary calculations MUST use a single documented source of truth.

### V. Testable Delivery
User-visible behavior and security-sensitive behavior MUST be covered by automated tests.
The project MUST use Jest and Supertest for unit and HTTP integration coverage, including
authentication, authorization, ownership failures, validation failures, category rules,
transaction mutations, and statistics. Tests MUST be deterministic and runnable in CI.
Features MUST be independently verifiable by user story, with tests added alongside the
implementation rather than deferred to a final hardening pass.

### VI. Observable, Documented Operations
Global error handling MUST return consistent safe error responses without leaking secrets or
implementation details. Security-relevant and mutation operations MUST be logged with useful
structured context while excluding passwords, tokens, and sensitive financial payloads.
Public API behavior MUST be documented with Swagger, and deployment configuration, required
environment variables, and operational assumptions MUST be documented close to the code.
Simplicity is preferred: new abstractions require a clear reduction in duplication or risk.

## Technology and Security Constraints

FlashFinance MUST use Next.js with the App Router, TypeScript, and Tailwind CSS. Server
Components MUST be the default; Client Components MUST be limited to interactive or
browser-only behavior. Routes MUST follow Next.js file-based routing conventions. Tailwind
utility classes MUST be the default styling approach; custom CSS is permitted only when a
utility or existing component convention cannot express the required behavior.

The application MUST use the required security controls: Zod validation, bcrypt password
hashing, JWT access and refresh tokens, refresh-token hashing, Helmet, CORS, rate limiting,
authentication/authorization middleware, and resource-ownership checks. Secrets MUST come
from environment configuration and MUST NOT be committed to the repository.

## Development Workflow and Quality Gates

Every feature MUST identify its user stories, acceptance scenarios, data ownership rules,
validation boundaries, and test strategy before implementation. Pull requests MUST pass
formatting, linting, strict type checking, relevant Jest/Supertest tests, and a production
build before merge. Reviews MUST check the Constitution Check in the implementation plan,
server/client boundaries, authorization on every private mutation, and the absence of secret
or token leakage. Swagger and deployment documentation MUST be updated when public behavior
or operational requirements change.

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

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-09-14
