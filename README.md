<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# ECOM-NESTJS

<em>Empowering Commerce Through Seamless Innovation and Scale</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/locvot/Ecom-nestjs?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/locvot/Ecom-nestjs?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/locvot/Ecom-nestjs?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
<img src="https://img.shields.io/badge/Resend-000000.svg?style=flat&logo=Resend&logoColor=white" alt="Resend">
<img src="https://img.shields.io/badge/Socket.io-010101.svg?style=flat&logo=socketdotio&logoColor=white" alt="Socket.io">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Redis-FF4438.svg?style=flat&logo=Redis&logoColor=white" alt="Redis">
<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">
<img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black" alt=".ENV">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<br>
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white" alt="tsnode">
<img src="https://img.shields.io/badge/Lodash-3492FF.svg?style=flat&logo=Lodash&logoColor=white" alt="Lodash">
<img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" alt="Prisma">
<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white" alt="Zod">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Socket-C93CD7.svg?style=flat&logo=Socket&logoColor=white" alt="Socket">
<img src="https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white" alt="datefns">
<img src="https://img.shields.io/badge/Jest-C21325.svg?style=flat&logo=Jest&logoColor=white" alt="Jest">

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
