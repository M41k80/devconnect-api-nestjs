# Contributing to DevConnect API

First off — thank you for taking the time to contribute. 

DevConnect is an open-source project built by developers, for IT professionals . Every contribution matters, whether it’s fixing a typo, improving a test, or shipping a brand new feature. This guide will help you get up and running quickly and ensure your contribution fits smoothly into the project.

-----

## Table of Contents

- [Contributing to DevConnect API](#contributing-to-devconnect-api)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Ways to Contribute](#ways-to-contribute)
  - [Before You Start](#before-you-start)
  - [Development Setup](#development-setup)
    - [1. Fork and clone](#1-fork-and-clone)
    - [2. Add the upstream remote](#2-add-the-upstream-remote)
    - [3. Install dependencies](#3-install-dependencies)
    - [4. Configure environment](#4-configure-environment)
    - [5. Start the database](#5-start-the-database)
    - [6. Run migrations](#6-run-migrations)
    - [7. Start the development server](#7-start-the-development-server)
  - [Project Structure](#project-structure)
  - [Branching Strategy](#branching-strategy)
  - [Commit Convention](#commit-convention)
    - [Types](#types)
    - [Scope (optional but recommended)](#scope-optional-but-recommended)
    - [Examples](#examples)
  - [Coding Standards](#coding-standards)
    - [TypeScript](#typescript)
    - [NestJS Patterns](#nestjs-patterns)
    - [Swagger Documentation](#swagger-documentation)
    - [Code Style](#code-style)
  - [Writing Tests](#writing-tests)
    - [Unit tests](#unit-tests)
    - [E2E tests](#e2e-tests)
    - [Test requirements](#test-requirements)
  - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Checklist before opening a PR](#checklist-before-opening-a-pr)
    - [PR title format](#pr-title-format)
    - [PR description template](#pr-description-template)
  - [Review Process](#review-process)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Questions \& Support](#questions--support)

-----

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing. We are committed to providing a welcoming and respectful environment for everyone.

-----

## Ways to Contribute

You don’t have to write code to contribute. Here are all the ways you can help:

|Type               |Examples                                                           |
|-------------------|-------------------------------------------------------------------|
|🐛 **Bug fixes**    |Fix a broken endpoint, resolve an edge case, correct error handling|
|✨ **Features**     |New endpoints, new filters, improve discovery algorithm            |
|📖 **Documentation**|Improve the README, fix typos, clarify setup steps                 |
|🧪 **Tests**        |Add missing unit tests, improve E2E coverage                       |
|🔒 **Security**     |Report vulnerabilities, improve auth hardening                     |
|🎨 **Refactoring**  |Improve code clarity, reduce duplication, apply better patterns    |
|💬 **Discussion**   |Open issues, share ideas, give feedback on PRs                     |

-----

## Before You Start

1. **Search existing issues** — your idea or bug may already be tracked. Avoid duplicate effort.
1. **Open an issue first** for significant changes (new features, breaking changes, architecture decisions) so the team can align before you invest time coding.
1. **Small fixes** (typos, documentation, minor bugs) can go straight to a PR without a prior issue.

-----

## Development Setup

### 1. Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/devconnect-api.git
cd devconnect-api
```

### 2. Add the upstream remote

```bash
git remote add upstream https://github.com/devconnect/devconnect-api.git
```

### 3. Install dependencies

```bash
yarn install
```

### 4. Configure environment

```bash
cp .env.template .env
# Edit .env with your local values
```

### 5. Start the database

```bash
docker-compose up -d
```

### 6. Run migrations

```bash
yarn migration:run
```

### 7. Start the development server

```bash
yarn start:dev
```

The API will be running at `http://localhost:3000/api`.  
Swagger UI is available at `http://localhost:3000/api`.

-----

## Project Structure

Understanding the codebase before contributing helps you put your changes in the right place.

```
src/
├── auth/                 # JWT auth, guards, strategies, decorators
├── users/                # User profiles, account management
├── projects/             # Projects, applications, members, discovery
├── follows/              # Social follow/unfollow system
├── skills/               # Skills catalog (admin-managed)
├── professional-roles/   # Professional roles catalog (admin-managed)
├── metadata/             # Registration metadata aggregator
├── database/             # Migrations, seeders, data source config
└── common/               # Shared filters, interceptors, interfaces
```

Each feature module follows the same structure:

```
feature/
├── dto/                  # Request/response DTOs with class-validator decorators
├── entities/             # TypeORM entity definitions
├── enums/                # TypeScript enums (if applicable)
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
└── feature.service.spec.ts
```

-----

## Branching Strategy

Always branch off from `main`. Use the following naming convention:

|Prefix     |When to use                              |Example                         |
|-----------|-----------------------------------------|--------------------------------|
|`feature/`    |New feature or enhancement               |`feat/project-bookmarks`        |
|`fix/`     |Bug fix                                  |`fix/refresh-token-rotation`    |
|`docs/`    |Documentation changes only               |`docs/update-auth-flow`         |
|`test/`    |Adding or improving tests                |`test/projects-service-coverage`|
|`refactor/`|Code refactoring without behavior changes|`refactor/users-service-cleanup`|
|`chore/`   |Tooling, dependencies, config            |`chore/upgrade-nestjs-11`       |

```bash
# Always start from an up-to-date main
git checkout main
git pull upstream main

# Create your branch
git checkout -b feat/your-feature-name
```

-----

## Commit Convention

This project follows the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. All commits must follow this format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

|Type      |Description                                            |
|----------|-------------------------------------------------------|
|`feat`    |A new feature                                          |
|`fix`     |A bug fix                                              |
|`docs`    |Documentation changes only                             |
|`test`    |Adding or modifying tests                              |
|`refactor`|Code change that neither fixes a bug nor adds a feature|
|`chore`   |Dependency updates, config changes, tooling            |
|`perf`    |Performance improvement                                |
|`ci`      |CI/CD configuration changes                            |

### Scope (optional but recommended)

Use the module name as scope: `auth`, `users`, `projects`, `follows`, `skills`, `roles`, `db`, `common`.

### Examples

```
feat(projects): add project bookmarking endpoint
fix(auth): prevent race condition in refresh token rotation
docs(readme): update environment variable table
test(projects): add unit tests for discoverProjects scoring
refactor(users): extract pagination logic into helper
chore(deps): upgrade nestjs to v11.2
```

> ⚠️ Commits that don’t follow this convention will be flagged during PR review.

-----

## Coding Standards

### TypeScript

- Use **strict typing** everywhere. Avoid `any`.
- Prefer `interface` for object shapes used as contracts; `type` for unions and computed types.
- All public service methods must have explicit return types.

### NestJS Patterns

- **Controllers** should be thin — no business logic. Delegate everything to the service.
- **Services** own all business logic and data access.
- **DTOs** must use `class-validator` decorators for every field that requires validation.
- **Entities** use TypeORM decorators. Relations should be defined on both sides.
- **Modules** must declare all providers, imports, and exports explicitly.

### Swagger Documentation

Every new endpoint **must** include Swagger decorators:

```typescript
@ApiOperation({ summary: 'Short description of what the endpoint does' })
@ApiResponse({ status: 200, description: 'Success description' })
@ApiResponse({ status: 404, description: 'Resource not found' })
```

New request body DTOs must include `@ApiProperty()` on every field.

### Code Style

- Formatting is handled by **Prettier** — run `yarn format` before committing.
- Linting is enforced by **ESLint** — run `yarn lint` before committing.
- No unused imports, no commented-out code blocks, no `console.log` in production code.

```bash
# Run both before pushing
yarn lint
yarn format
```

-----

## Writing Tests

Every change to a service or controller should be accompanied by tests. We use **Jest** for unit tests and **Supertest** for E2E tests.

### Unit tests

Place unit test files alongside the file they test, using the `.spec.ts` suffix:

```
users.service.ts
users.service.spec.ts
```

Unit tests mock all dependencies using Jest:

```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User),
      useValue: {
        findOne: jest.fn(),
        save: jest.fn(),
        // ...
      },
    },
  ],
}).compile();
```

### E2E tests

Place E2E test files in the `/test` directory:

```
test/
├── app.e2e-spec.ts
└── auth.e2e-spec.ts
```

### Test requirements

- New service methods must have unit tests covering the happy path and main error cases (e.g., `NotFoundException`, `BadRequestException`).
- New endpoints must have at least a basic E2E test verifying the response status code.
- Aim for descriptive test names: `it('should throw NotFoundException when user does not exist')`.

```bash
yarn test          # Run all unit tests
yarn test:cov      # Check coverage report
yarn test:e2e      # Run end-to-end tests
```

-----

## Submitting a Pull Request

### Checklist before opening a PR

- [ ] My branch is up to date with `upstream/main`
- [ ] All tests pass: `yarn test`
- [ ] No lint errors: `yarn lint`
- [ ] Code is formatted: `yarn format`
- [ ] New endpoints are documented with Swagger decorators
- [ ] I’ve added or updated tests for my changes
- [ ] My commits follow the Conventional Commits format

### PR title format

Follow the same convention as commits:

```
feat(projects): add project bookmarking
fix(auth): resolve token blacklist timing issue
```

### PR description template

When you open a PR, please fill out the following:

```
## What does this PR do?
Brief description of the change and the problem it solves.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Test
- [ ] Other

## How to test
Step-by-step instructions for the reviewer to verify the change.

## Related issue
Closes #<issue_number>

## Notes for reviewers
Anything that requires special attention or context.
```

-----

## Review Process

- All PRs require **at least one approval** from a maintainer before merging.
- Reviewers will check: correctness, test coverage, code style, security implications, and Swagger documentation.
- Please be responsive to review comments. PRs inactive for more than 14 days may be closed.
- Once approved, a maintainer will merge using **Squash and Merge** to keep the `main` history clean.

-----

## Reporting Bugs

Found a bug? Please open a GitHub issue with the following information:

1. **Title** — short and descriptive: `[BUG] Refresh token not revoked on concurrent requests`
1. **Environment** — Node version, OS, how you’re running the app
1. **Steps to reproduce** — the exact steps to trigger the bug
1. **Expected behavior** — what should happen
1. **Actual behavior** — what actually happens
1. **Logs / screenshots** — any relevant error output

> 🔒 **Security vulnerabilities** — please do **not** open a public issue. Instead, report them privately by emailing `securitydevconnect@m41k80dev.com` (or via GitHub’s private vulnerability reporting). We will acknowledge within 48 hours.

-----

## Suggesting Features

Have an idea to improve DevConnect? Open a GitHub issue with the `enhancement` label and include:

1. **The problem** — what pain point does this solve?
1. **The proposed solution** — how would it work from the user’s perspective?
1. **Alternatives considered** — other approaches you thought about
1. **Additional context** — mockups, examples from other projects, references

Feature requests are reviewed by maintainers and discussed openly. The community’s vote and alignment with the project roadmap determine prioritization.

-----

## Questions & Support

- **General questions** — open a GitHub Discussion in the `Q&A` category.
- **Bug reports** — open a GitHub Issue.
- **Feature ideas** — open a GitHub Issue with the `enhancement` label.
- **Security issues** — email `securitydevconnect@m41k80dev.comv` privately.

We appreciate your patience — maintainers are volunteers and will respond as soon as possible.

-----

<div align="center">

Thank you for being part of DevConnect 💜

</div>