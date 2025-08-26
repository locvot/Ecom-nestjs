<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# ECOM-NESTJS

<em>Empowering Commerce Through Seamless Innovation and Scale</em>


</div>
<br>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Features](#features)
- [Project Structure](#project-structure)

---

## Overview

Ecom-nestjs is a comprehensive backend framework tailored for building scalable, real-time e-commerce platforms. It leverages a modular NestJS architecture to facilitate maintainability and growth, while integrating WebSocket support for instant communication and updates. The core features include:

- 🧩 **Modular Design:** Enables flexible, scalable backend development with well-organized modules.
- 🌐 **Real-Time WebSocket Integration:** Supports live chat and payment updates through Redis-backed WebSocket gateways.
- 📊 **Rich Data Modeling:** Uses shared DTOs, models, and internationalization for multilingual, consistent data handling.
- 🔒 **Robust Security:** Implements guards, decorators, and 2FA for secure user authentication and role management.
- 💳 **Payment & Order Management:** Handles webhook processing, background jobs, and order lifecycle with reliability.
- 🛠️ **Developer-Friendly:** Configurable TypeScript, ESLint, and Prisma ORM ensure code quality and seamless database interactions.

---

## Features

|      | Component            | Details                                                                                     |
| :--- | :------------------- | :------------------------------------------------------------------------------------------ |
| ⚙️  | **Architecture**     | <ul><li>Modular monolith with clear separation of concerns</li><li>Uses NestJS framework for backend structure</li><li>Layered architecture: controllers, services, modules, repositories</li></ul> |
| 🔩 | **Code Quality**     | <ul><li>TypeScript with strict type enforcement</li><li>Consistent code style, likely enforced via ESLint & Prettier</li><li>Uses decorators for dependency injection and metadata</li></ul> |
| 📄 | **Documentation**    | <ul><li>Basic README with project overview</li><li>API documentation via Swagger (@nestjs/swagger)</li><li>Type definitions and Prisma schema documented</li></ul> |
| 🔌 | **Integrations**     | <ul><li>Database: Prisma ORM with PostgreSQL/MySQL</li><li>WebSockets: @nestjs/websockets, socket.io, Redis adapter</li><li>Messaging & Queues: BullMQ, Redis</li><li>Authentication: @nestjs/jwt, bcrypt</li><li>File Storage: AWS S3 via @aws-sdk</li><li>Email: react-email, resend</li><li>Logging & Monitoring: nestjs-pino, helmet for security</li></ul> |
| 🧩 | **Modularity**       | <ul><li>Feature modules for products, users, orders, payments, notifications</li><li>Shared modules for common utilities</li><li>Uses Prisma schema for data models</li></ul> |
| 🧪 | **Testing**          | <ul><li>Uses Jest for unit and e2e tests</li><li>Test setup includes @nestjs/testing, supertest</li><li>Test coverage likely enforced</li></ul> |
| ⚡️  | **Performance**      | <ul><li>Uses @nestjs/platform-express with compression</li><li>Async operations with RxJS</li><li>Redis & BullMQ for background jobs</li></ul> |
| 🛡️ | **Security**         | <ul><li>Helmet middleware for security headers</li><li>JWT for auth tokens</li><li>Rate limiting via @nestjs/throttler</li><li>Input validation with Zod & class-validator</li></ul> |
| 📦 | **Dependencies**     | <ul><li>Core: typescript, nestjs, prisma, rxjs</li><li>Utilities: lodash, date-fns, uuid</li><li>Security: bcrypt, helmet</li><li>Storage & Cloud: @aws-sdk, googleapis</li><li>Testing: jest, supertest</li></ul> |

---

## Project Structure

```sh
└── Ecom-nestjs/
    ├── README.md
    ├── emails
    │   └── otp.tsx
    ├── eslint.config.mjs
    ├── initialScript
    │   ├── create-permissions.ts
    │   └── index.ts
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── prisma
    │   ├── migrations
    │   └── schema.prisma
    ├── src
    │   ├── app.controller.spec.ts
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   ├── cronjobs
    │   ├── generated
    │   ├── i18n
    │   ├── main.ts
    │   ├── queues
    │   ├── routes
    │   ├── shared
    │   ├── types.ts
    │   └── websockets
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```


---

## Getting Started

### Installation

Build Ecom-nestjs from the source and install dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/locvot/Ecom-nestjs
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd Ecom-nestjs
    ```

3. **Install the dependencies:**

**Using [npm](https://www.npmjs.com/):**

```sh
❯ npm install
```

### Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```

### Testing

Ecom-nestjs uses the {__test_framework__} test framework. Run the test suite with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm test
```
---
