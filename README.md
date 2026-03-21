<div align="center">

<!-- <img src="my badge" alt="DevConnect API" /> -->


## Apóyame / Buy Me a Coffee

Si te gusta este proyecto, considera apoyarme:
If you like this project, consider supporting me:

<div>
  <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" 
  data-name="bmc-button" data-slug="m41k80" data-color="#FFDD00" 
  data-font="Cookie" data-text="Buy me a coffee" 
  data-outline-color="#000000" data-font-color="#000000" 
  data-coffee-color="#ffffff"></script>
</div>


# DevConnect API

**A REST API platform that connects developers to collaborate on real-world open source projects.**

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-FE0803?style=flat-square)](https://typeorm.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Getting Started](#getting-started) · [API Reference](#api-reference) · [Architecture](#architecture) · [Contributing](#contributing)

</div>

-----

## Table of Contents

- [DevConnect API](#devconnect-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Database Setup](#database-setup)
    - [Running the App](#running-the-app)
  - [Architecture](#architecture)
    - [Module Structure](#module-structure)
    - [Database Schema](#database-schema)
    - [Authentication Flow](#authentication-flow)
  - [API Reference](#api-reference)
    - [Response Envelope](#response-envelope)
    - [Auth Endpoints](#auth-endpoints)
      - [`POST /api/auth/register`](#post-apiauthregister)
      - [`POST /api/auth/login`](#post-apiauthlogin)
      - [`POST /api/auth/logout`](#post-apiauthlogout)
    - [Users Endpoints](#users-endpoints)
      - [`GET /api/users?limit=10&offset=0&search=john`](#get-apiuserslimit10offset0searchjohn)
      - [`PATCH /api/users/updateProfile`](#patch-apiusersupdateprofile)
      - [`PATCH /api/users/reactivate`](#patch-apiusersreactivate)
    - [Projects Endpoints](#projects-endpoints)
      - [`POST /api/projects`](#post-apiprojects)
      - [`GET /api/projects?page=1&limit=10&status=building&tech=NestJS&search=connect`](#get-apiprojectspage1limit10statusbuildingtechnestjssearchconnect)
      - [`POST /api/projects/:id/apply`](#post-apiprojectsidapply)
      - [`GET /api/projects/discover`](#get-apiprojectsdiscover)
    - [Follows Endpoints](#follows-endpoints)
    - [Skills Endpoints](#skills-endpoints)
    - [Professional Roles Endpoints](#professional-roles-endpoints)
    - [Metadata Endpoints](#metadata-endpoints)
  - [Security](#security)
  - [Testing](#testing)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
    - [Code Style](#code-style)
  - [License](#license)

-----

## Overview

**DevConnect** is an open-source REST API built with NestJS that powers a developer collaboration platform. Developers can register with their professional roles and skills, create or join projects, and follow other developers — creating a social layer built specifically for builders.

The API is designed to be consumed by any frontend client (web, mobile, CLI) and exposes a fully documented OpenAPI/Swagger interface available at `/api` when running.

-----

## Features

- 🔐 **JWT Authentication** — Stateless access tokens (30min) + HttpOnly refresh tokens (7 days) with rotation and revocation
- 🛡️ **Role-Based Access Control** — `USER` and `ADMIN` roles with guard-protected routes
- 👤 **Developer Profiles** — Rich profiles with bio, location, GitHub, LinkedIn, portfolio links, skills, and professional role
- 🚀 **Project Management** — Create, update, archive projects with status lifecycle (`idea → building → mvp → launched`)
- 📋 **Application System** — Apply to projects with a message; owners can accept or reject applicants who are auto-added as members
- 🔍 **Project Discovery** — Skill-based intelligent matching that scores projects by relevance to the user’s tech stack and role
- 👥 **Social Following** — Follow/unfollow developers, view followers and following lists
- 📄 **Pagination & Filtering** — Projects filterable by status, tech stack, and full-text search
- 🚦 **Rate Limiting** — Throttler protection on sensitive endpoints (e.g. login: 10 requests/min)
- 📦 **Global Response Format** — Unified response envelope and exception filter across all endpoints
- 🐳 **Docker Ready** — PostgreSQL containerized via `docker-compose`
- 📖 **Swagger UI** — Auto-generated interactive API docs at `/api`

-----

## Tech Stack

|Layer           |Technology                                                      |
|----------------|----------------------------------------------------------------|
|Framework       |[NestJS](https://nestjs.com/) v11                               |
|Language        |[TypeScript](https://www.typescriptlang.org/) v5                |
|Database        |[PostgreSQL](https://www.postgresql.org/) 14                    |
|ORM             |[TypeORM](https://typeorm.io/) v0.3                             |
|Auth            |JWT (access + refresh tokens) via `@nestjs/jwt` & `passport-jwt`|
|Validation      |`class-validator` + `class-transformer`                         |
|Documentation   |`@nestjs/swagger` (OpenAPI 3)                                   |
|Rate Limiting   |`@nestjs/throttler`                                             |
|Password Hashing|`bcrypt`                                                        |
|Containerization|Docker + docker-compose                                         |
|Testing         |Jest + Supertest                                                |
|Package Manager |Yarn                                                            |

-----

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Yarn** >= 1.22
- **Docker** & **Docker Compose** (for the database)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/devconnect-api.git
cd devconnect-api

# 2. Install dependencies
yarn install
```

### Environment Variables

Copy the template and fill in your values:

```bash
cp .env.template .env
```

|Variable     |Description                       |Default                    |
|-------------|----------------------------------|---------------------------|
|`STAGE`      |Environment stage (`dev` / `prod`)|`dev`                      |
|`DB_USER`    |PostgreSQL username               |`postgres`                 |
|`DB_PASSWORD`|PostgreSQL password               |`postgres`                 |
|`DB_NAME`    |Database name                     |`DB`                       |
|`DB_HOST`    |Database host                     |`localhost`                |
|`DB_PORT`    |Database port                     |`5432`                     |
|`JWT_SECRET` |Secret key for JWT signing        |*(required)*               |
|`PORT`       |HTTP port for the API             |`3000`                     |
|`HOST_API`   |Full base URL of the API          |`http://localhost:3000/api`|


> ⚠️ **Important:** Never commit your `.env` file. Always use a strong, random `JWT_SECRET` in production.

### Database Setup

Start the PostgreSQL instance with Docker:

```bash
docker-compose up -d
```

Run database migrations:

```bash
yarn migration:run
```

*(Optional)* Seed initial data:

```bash
yarn ts-node src/database/seed/seed.ts
```

### Running the App

```bash
# Development (watch mode)
yarn start:dev

# Production build
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

The API will be available at `http://localhost:3000/api`.  
Swagger UI will be available at `http://localhost:3000/api`.

-----

## Architecture

### Module Structure

```
src/
├── auth/                    # Authentication & authorization
│   ├── decorators/          # @Roles() decorator
│   ├── dto/                 # RegisterDto, LoginUserDto
│   ├── entities/            # Auth, RefreshToken, BlacklistedToken
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   ├── interface/           # JWT payload interfaces
│   ├── strategies/          # PassportJS JWT strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/                   # User profile management
│   ├── dto/                 # UpdateUserDto, PaginationQueryDto
│   ├── entities/            # User entity
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── projects/                # Project management & applications
│   ├── dto/                 # CreateProjectDto, ApplyProjectDto, etc.
│   ├── entities/            # Project, ProjectMember, ProjectApplication
│   ├── enums/               # ProjectStatus, ApplicationStatus
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
│
├── follows/                 # Social follow system
│   ├── entities/            # Follow entity
│   ├── follows.controller.ts
│   ├── follows.service.ts
│   └── follows.module.ts
│
├── skills/                  # Skills catalog (Admin-managed)
│   ├── dto/                 # CreateSkillDto
│   ├── entities/            # Skill entity
│   ├── skills.controller.ts
│   ├── skills.service.ts
│   └── skills.module.ts
│
├── professional-roles/      # Professional roles catalog (Admin-managed)
│   ├── dto/                 # CreateProfessionalRoleDto
│   ├── entities/            # ProfessionalRole entity
│   └── ...
│
├── metadata/                # Registration metadata aggregator
│   └── ...
│
├── database/                # DB config, migrations, seeders
│   ├── migrations/
│   ├── seeders/
│   └── data-source.ts
│
└── common/                  # Shared utilities
    ├── filters/             # GlobalExceptionFilter
    ├── interceptors/        # ResponseInterceptor (unified envelope)
    └── interface/           # Response format interfaces
```

### Database Schema

```
┌─────────────────┐       ┌──────────────────────┐
│     users       │       │   professional_roles  │
├─────────────────┤       ├──────────────────────┤
│ id (uuid) PK    │──┐    │ id (uuid) PK          │
│ email           │  │    │ name                  │
│ password        │  │    └──────────────────────┘
│ fullName        │  │             ▲
│ bio             │  │             │ ManyToOne
│ location        │  └────────────┘
│ github          │
│ linkedin        │    ┌──────────────┐
│ portfolio       │    │  user_skills │
│ role (enum)     │────│──────────────│────┐
│ isActive        │    │ user_id      │    │
│ deletedAt       │    │ skill_id     │    │
│ createdAt       │    └──────────────┘    │
│ updatedAt       │                        ▼
└─────────────────┘              ┌──────────────┐
        │                        │    skills    │
        │                        ├──────────────┤
        │                        │ id (uuid) PK │
        │                        │ name         │
        │                        └──────────────┘
        │
        │  ┌──────────────────┐
        ├──│    follows       │
        │  ├──────────────────┤
        │  │ id (uuid) PK     │
        │  │ follower_id (FK) │
        │  │ following_id(FK) │
        │  └──────────────────┘
        │
        │  ┌──────────────────────┐
        ├──│      projects        │
        │  ├──────────────────────┤
        │  │ id (uuid) PK         │
        │  │ title                │
        │  │ description          │
        │  │ techStack (text[])   │
        │  │ repositoryUrl        │
        │  │ demoUrl              │
        │  │ docsUrl              │
        │  │ status (enum)        │
        │  │ isActive             │
        │  │ owner_id (FK)        │
        │  │ deletedAt            │
        │  └──────────────────────┘
        │           │
        │   ┌───────┴──────────────────┐
        │   │                          │
        │  ┌────────────────┐  ┌───────────────────────┐
        └──│ project_members│  │  project_applications  │
           ├────────────────┤  ├───────────────────────┤
           │ id (uuid) PK   │  │ id (uuid) PK           │
           │ project_id(FK) │  │ project_id (FK)        │
           │ user_id (FK)   │  │ user_id (FK)           │
           └────────────────┘  │ message                │
                               │ status (enum)          │
                               └───────────────────────┘
```

### Authentication Flow

```
┌────────────┐          ┌───────────┐          ┌──────────────┐
│   Client   │          │    API    │          │   Database   │
└─────┬──────┘          └─────┬─────┘          └──────┬───────┘
      │                       │                        │
      │  POST /auth/login      │                        │
      │──────────────────────>│                        │
      │                       │  findByEmail()          │
      │                       │───────────────────────>│
      │                       │  user                   │
      │                       │<───────────────────────│
      │                       │  bcrypt.compare()       │
      │                       │  issueTokens()          │
      │                       │  saveRefreshToken()     │
      │                       │───────────────────────>│
      │  Set-Cookie: token     │                        │
      │  Set-Cookie: refreshToken                       │
      │<──────────────────────│                        │
      │                       │                        │
      │  GET /protected        │                        │
      │  Cookie: token         │                        │
      │──────────────────────>│                        │
      │                       │  JwtStrategy.validate()│
      │                       │  isBlacklisted?         │
      │                       │───────────────────────>│
      │  200 OK + data         │                        │
      │<──────────────────────│                        │
      │                       │                        │
      │  POST /auth/refresh    │                        │
      │  Cookie: refreshToken  │                        │
      │──────────────────────>│                        │
      │                       │  verify + rotate token  │
      │  New cookies issued    │                        │
      │<──────────────────────│                        │
      │                       │                        │
      │  POST /auth/logout     │                        │
      │──────────────────────>│                        │
      │                       │  blacklist token        │
      │                       │  revoke refresh tokens  │
      │  Cookies cleared       │                        │
      │<──────────────────────│                        │
```

**Token details:**

|Token             |Storage          |TTL         |Notes                                 |
|------------------|-----------------|------------|--------------------------------------|
|Access Token      |`HttpOnly` cookie|30 minutes  |Used for authenticated requests       |
|Refresh Token     |`HttpOnly` cookie|7 days      |Hashed in DB; rotation on every use   |
|Blacklisted Tokens|Database         |Until expiry|Stores revoked access tokens on logout|

-----

## API Reference

> All endpoints are prefixed with `/api`. The full Swagger UI is available at `http://localhost:3000/api`.

### Response Envelope

All responses follow a unified format:

```json
{
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses follow:

```json
{
  "statusCode": 400,
  "message": "Descriptive error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

-----

### Auth Endpoints

**Base path:** `/api/auth`

|Method |Endpoint               |Auth   |Description                            |
|-------|-----------------------|-------|---------------------------------------|
|`POST` |`/register`            |Public |Register a new developer account       |
|`POST` |`/login`               |Public |Login and receive auth cookies         |
|`POST` |`/refresh`             |Cookie |Rotate access token using refresh token|
|`POST` |`/logout`              |🔒 JWT  |Logout and revoke all tokens           |
|`PATCH`|`/:id/deactivate`      |🔒 ADMIN|Deactivate a user account              |
|`PATCH`|`/admin/reactivate/:id`|🔒 ADMIN|Reactivate a user account              |

#### `POST /api/auth/register`

```json
// Request body
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!",
  "fullName": "John Doe",
  "professionalRoleId": "uuid-of-role",
  "skills": ["uuid-skill-1", "uuid-skill-2"]
}
```

> Password requirements: minimum 6 chars, max 50, must include uppercase, lowercase, and a number or special character.

```json
// Response 200
{
  "id": "uuid",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "professionalRole": "Backend Developer"
}
```

#### `POST /api/auth/login`

> Rate limited: 10 requests per minute per IP.

```json
// Request body
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!"
}
```

```json
// Response 200 + sets HttpOnly cookies: token, refreshToken
{
  "message": "Login success"
}
```

#### `POST /api/auth/logout`

Requires valid JWT cookie. Blacklists the current access token and revokes all refresh tokens for the user.

```json
// Response 200
{
  "message": "Logged out successfully"
}
```

-----

### Users Endpoints

**Base path:** `/api/users`

|Method |Endpoint        |Auth   |Description                     |
|-------|----------------|-------|--------------------------------|
|`GET`  |`/`             |Public |Get paginated public user list  |
|`GET`  |`/me`           |🔒 JWT  |Get authenticated user’s profile|
|`GET`  |`/:id`          |Public |Get a user’s public profile     |
|`GET`  |`/admin`        |🔒 ADMIN|Get all users (admin view)      |
|`PATCH`|`/updateProfile`|🔒 JWT  |Update own profile              |
|`PATCH`|`/deactivate`   |🔒 JWT  |Soft-delete own account         |
|`PATCH`|`/reactivate`   |Public |Reactivate a deactivated account|

#### `GET /api/users?limit=10&offset=0&search=john`

|Query Param|Type  |Default|Description                           |
|-----------|------|-------|--------------------------------------|
|`limit`    |number|`10`   |Items per page                        |
|`offset`   |number|`0`    |Items to skip                         |
|`search`   |string|—      |Filter by full name (case-insensitive)|

```json
// Response 200
{
  "data": [
    { "id": "uuid", "fullName": "John Doe", "createdAt": "..." }
  ],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "totalPages": 10
  }
}
```

#### `PATCH /api/users/updateProfile`

```json
// Request body (all fields optional)
{
  "fullName": "John Doe",
  "bio": "Full-stack developer",
  "location": "Madrid, Spain",
  "github": "github.com/johndoe",
  "linkedin": "linkedin.com/in/johndoe",
  "portfolio": "johndoe.dev"
}
```

#### `PATCH /api/users/reactivate`

```json
// Request body
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!"
}
```

-----

### Projects Endpoints

**Base path:** `/api/projects`

|Method  |Endpoint                  |Auth         |Description                              |
|--------|--------------------------|-------------|-----------------------------------------|
|`POST`  |`/`                       |🔒 JWT        |Create a new project                     |
|`GET`   |`/`                       |Public       |List projects with filters & pagination  |
|`GET`   |`/:id`                    |Public       |Get project details                      |
|`PATCH` |`/:id`                    |🔒 JWT (owner)|Update project                           |
|`DELETE`|`/:id`                    |🔒 JWT (owner)|Archive project (soft delete)            |
|`GET`   |`/:id/members`            |Public       |Get project members                      |
|`POST`  |`/:id/apply`              |🔒 JWT        |Apply to join a project                  |
|`GET`   |`/:id/applications`       |🔒 JWT (owner)|List applications for a project          |
|`PATCH` |`/applications/:id/accept`|🔒 JWT (owner)|Accept an application                    |
|`PATCH` |`/applications/:id/reject`|🔒 JWT (owner)|Reject an application                    |
|`GET`   |`/applied`                |🔒 JWT        |Get projects the user has applied to     |
|`GET`   |`/discover`               |🔒 JWT        |Get skill-matched project recommendations|

#### `POST /api/projects`

```json
// Request body
{
  "title": "DevConnect",
  "description": "A platform for developer collaboration.",
  "techStack": ["NestJS", "PostgreSQL", "NextJS"],
  "repositoryUrl": "https://github.com/org/repo",
  "demoUrl": "https://devconnect.app",
  "docsUrl": "https://docs.devconnect.app",
  "status": "building"
}
```

**Project Status Values:**

|Status    |Description                           |
|----------|--------------------------------------|
|`idea`    |Project is in ideation phase (default)|
|`building`|Active development underway           |
|`mvp`     |Minimum viable product reached        |
|`launched`|Project is live and released          |

```json
// Response 201
{
  "id": "uuid",
  "title": "DevConnect",
  "description": "...",
  "techStack": ["NestJS", "PostgreSQL", "NextJS"],
  "owner": { "id": "uuid", "fullName": "John Doe" }
}
```

#### `GET /api/projects?page=1&limit=10&status=building&tech=NestJS&search=connect`

|Query Param|Type             |Description                                           |
|-----------|-----------------|------------------------------------------------------|
|`page`     |number           |Page number (default: `1`)                            |
|`limit`    |number           |Items per page (default: `10`)                        |
|`status`   |string           |Filter by `ProjectStatus` enum                        |
|`tech`     |string / string[]|Filter by tech stack (partial match, case-insensitive)|
|`search`   |string           |Full-text search on title and description             |

#### `POST /api/projects/:id/apply`

```json
// Request body
{
  "message": "I'd love to contribute to this project! I have 3 years of NestJS experience."
}
```

#### `GET /api/projects/discover`

Returns up to 20 projects scored by relevance to the authenticated user’s skills and professional role. Projects are ranked by a scoring system:

- **+2 points** per matching tech stack skill
- **+1 point** if the user’s professional role is mentioned in the project description

```json
// Response 200
[
  {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "techStack": ["..."],
    "score": 5,
    "owner": { "id": "uuid", "fullName": "..." }
  }
]
```

-----

### Follows Endpoints

**Base path:** `/api/follows`

|Method  |Endpoint              |Auth |Description                  |
|--------|----------------------|-----|-----------------------------|
|`POST`  |`/:id`                |🔒 JWT|Follow a user                |
|`DELETE`|`/:id`                |🔒 JWT|Unfollow a user              |
|`GET`   |`/users/:id/followers`|🔒 JWT|Get followers of a user      |
|`GET`   |`/users/:id/following`|🔒 JWT|Get users that a user follows|

```json
// Response for GET /follows/users/:id/followers
{
  "follower": [
    { "id": "uuid", "fullName": "Jane Smith", ... }
  ]
}
```

-----

### Skills Endpoints

**Base path:** `/api/skills`

|Method|Endpoint|Auth   |Description              |
|------|--------|-------|-------------------------|
|`GET` |`/`     |Public |List all available skills|
|`POST`|`/`     |🔒 ADMIN|Create a new skill       |

Skills are used during registration and are referenced by UUID. Use `GET /api/metadata/register` to fetch all skills and professional roles at once for registration forms.

-----

### Professional Roles Endpoints

**Base path:** `/api/professional-roles`

|Method|Endpoint|Auth   |Description                   |
|------|--------|-------|------------------------------|
|`GET` |`/`     |Public |List all professional roles   |
|`POST`|`/`     |🔒 ADMIN|Create a new professional role|

Examples: `Backend Developer`, `Frontend Developer`, `DevOps Engineer`, `UI/UX Designer`, `Mobile Developer`.

-----

### Metadata Endpoints

**Base path:** `/api/metadata`

|Method|Endpoint   |Auth  |Description                                         |
|------|-----------|------|----------------------------------------------------|
|`GET` |`/register`|Public|Get all skills + professional roles for registration|

This endpoint is a convenience aggregator for frontend registration forms. It returns all available skills and professional roles in a single request.

-----

## Security

The API implements multiple layers of security:

- **HttpOnly Cookies** — Tokens are stored in `HttpOnly` cookies, preventing XSS-based token theft.
- **Token Blacklisting** — On logout, the access token is stored in a blacklist table until its natural expiry.
- **Refresh Token Rotation** — Each use of a refresh token revokes the old one and issues a new one, limiting exposure from token theft.
- **Bcrypt Password Hashing** — Passwords are hashed with bcrypt (salt rounds: 10). Refresh tokens are also hashed before storage.
- **Role Guards** — `ADMIN`-only endpoints are protected by `RolesGuard` combined with `JwtAuthGuard`.
- **Rate Limiting** — Login is throttled to 10 requests/minute to prevent brute-force attacks.
- **Input Validation** — `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` strips and rejects unknown properties globally.
- **Soft Deletes** — Users and projects are soft-deleted via `deletedAt` timestamp, preserving data integrity.

-----

## Testing

```bash
# Unit tests
yarn test

# Unit tests with watch mode
yarn test:watch

# Test coverage report
yarn test:cov

# End-to-end tests
yarn test:e2e
```

The test suite uses **Jest** for unit tests and **Supertest** for E2E tests. Key modules covered:

- `AuthService` — registration, login, token issuance, refresh, logout
- `AuthController` — endpoint integration
- `JwtAuthGuard` — token validation and blacklist check
- `JwtStrategy` — passport strategy verification
- `ProjectsService` — CRUD, applications, discovery
- `SkillsService` — catalog management
- `FollowsService` — follow/unfollow logic

-----

## Scripts

|Script                   |Description                                 |
|-------------------------|--------------------------------------------|
|`yarn start:dev`         |Start in watch mode (development)           |
|`yarn start:prod`        |Start compiled production build             |
|`yarn build`             |Compile TypeScript to `dist/`               |
|`yarn test`              |Run unit tests                              |
|`yarn test:cov`          |Run tests with coverage report              |
|`yarn test:e2e`          |Run end-to-end tests                        |
|`yarn lint`              |Lint and auto-fix code                      |
|`yarn format`            |Format code with Prettier                   |
|`yarn migration:generate`|Generate a new migration from entity changes|
|`yarn migration:run`     |Apply pending migrations to the database    |
|`yarn migration:revert`  |Revert the last applied migration           |
|`yarn migration:show`    |List all migrations and their status        |

-----

## Contributing

Contributions are welcome! Here’s how to get started:

1. **Fork** the repository
1. **Clone** your fork: `git clone https://github.com/your-username/devconnect-api.git`
1. **Create a branch**: `git checkout -b feat/your-feature-name`
1. **Make your changes** and write tests
1. **Ensure tests pass**: `yarn test`
1. **Lint your code**: `yarn lint`
1. **Commit** with a meaningful message following [Conventional Commits](https://www.conventionalcommits.org/):
   
   ```
   feature: add project bookmarking
   fix: resolve refresh token race condition
   docs: update authentication flow diagram
   ```
1. **Push** your branch and open a **Pull Request**

### Code Style

- All code is written in **TypeScript** with strict typing
- Follow the existing NestJS module pattern (controller → service → repository)
- Each module should have unit tests for its service and controller
- Use DTOs with class-validator decorators for all request bodies
- Document new endpoints with `@ApiOperation`, `@ApiResponse`, and `@ApiBody` decorators

-----

## License

This project is open-source and available under the [MIT License](LICENSE).

-----

<div align="center">

Built with ❤️ by m41k80

[⬆ Back to Top](#devconnect-api)

</div>