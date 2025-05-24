# Talaba365 LMS Backend

![Build](https://img.shields.io/github/actions/workflow/status/akromjonakhmadjonoff/talaba365-lms/ci.yml?branch=main)
![License](https://img.shields.io/github/license/akromjonakhmadjonoff/talaba365-lms)
![Issues](https://img.shields.io/github/issues/akromjonakhmadjonoff/talaba365-lms)
![Stars](https://img.shields.io/github/stars/akromjonakhmadjonoff/talaba365-lms?style=social)

A scalable, multi-tenant Learning Management System (LMS) backend built using NestJS, Prisma, and PostgreSQL. Designed
to support both large educational institutions with dedicated databases and smaller clients via a shared schema.

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/talaba365-backend.git
cd talaba365-backend

# 2. Install dependencies
yarn install

# 3. Create environment file
cp .env.example .env


# 4. Edit `.env` with your database credentials
# Example content:
# DATABASE_URL=postgresql://user:password@localhost:5432/shared
# CONTROL_DB_URL=postgresql://user:password@localhost:5432/control

# 5. Run Prisma migrations
npx prisma migrate dev --schema=prisma/shared/schema.prisma
npx prisma migrate dev --schema=prisma/control/schema.prisma

# 6. Start the development server
yarn start:dev
```

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Planned Features](#planned-features)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Multi-tenant support with hybrid database model
- Separation of control, shared, and tenant schemas
- Modular and scalable NestJS architecture
- User management module (CRUD)
- Integrated Prisma ORM with isolated clients
- Configurable environment for different deployment setups
- i18n internationalization support

---

## Architecture Overview

This project follows a hybrid multi-tenant architecture:

- **Dedicated databases** for large tenants (e.g., universities)
- **Shared database** for individuals or small centers
- A **control database** for managing tenants and routing

Each Prisma client is separated and dynamically managed based on the tenant context.

---

## Technology Stack

| Layer            | Technology       |
|------------------|------------------|
| Language         | TypeScript       |
| Framework        | NestJS           |
| ORM              | Prisma           |
| Database         | PostgreSQL       |
| Authentication   | Passport.js      |
| Admin Interface  | AdminJS          |
| Containerization | Docker (planned) |
| CI/CD            | GitHub Actions   |

---

## Folder Structure

```text
lms_backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── config/
│   │   └── config.service.ts
│   ├── users/
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   └── user.module.ts
│   └── shared/
│       ├── filters/
│       ├── guards/
│       └── interceptors/
├── prisma/
│   ├── tenant/
│   │   ├── schema.prisma
│   │   └── tenant_prisma.ts
│   ├── shared/
│   │   ├── schema.prisma
│   │   └── shared_prisma.ts
│   └── control/
│       ├── schema.prisma
│       └── control_prisma.ts
├── .env
├── package.json
├── tsconfig.json
├── .prettierrc
├── .eslintrc.cjs
└── README.md
```
