# PROJECT_BOOTSTRAP.md

# Investment Portfolio Management System

## Project Bootstrap Guide

---

# Welcome

Welcome to the Investment Portfolio Management System.

This document is the starting point for every developer and AI assistant working on this project.

Before implementing any feature, read this document first.

The documentation inside `/docs` is the single source of truth for the project.

Do not make architectural or business decisions without consulting the documentation.

---

# Project Goals

The goal of this project is to build a production-ready Investment Portfolio Management System.

Core objectives:

- Secure Authentication
- Portfolio Management
- Investment Tracking
- Financial Goal Management
- Dashboard Analytics
- Clean Architecture
- Scalable Backend
- Responsive Frontend

---

# Technology Stack

Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Zod Validation

Frontend

- Next.js
- React
- Tailwind CSS
- React Hook Form
- TanStack Query

Package Manager

- pnpm

---

# Documentation Structure

The project documentation is organized as follows.

```
docs/

01_PROJECT_RULES.md
02_ARCHITECTURE.md
03_DATABASE_GUIDE.md
04_BUSINESS_RULES.md
05_API_CONVENTION.md
06_API_REFERENCE.md
07_FOLDER_STRUCTURE.md
08_UI_FLOW.md
09_DEVELOPMENT_GUIDE.md
10_ROADMAP.md
11_SECURITY_GUIDE.md
12_AI_CONTEXT.md
13_CODING_STANDARDS.md
```

Each document has a specific responsibility.

---

# Documentation Reading Order

Always read documentation in this order.

1. PROJECT_BOOTSTRAP.md
2. 01_PROJECT_RULES.md
3. 02_ARCHITECTURE.md
4. 03_DATABASE_GUIDE.md
5. 04_BUSINESS_RULES.md
6. 05_API_CONVENTION.md
7. 06_API_REFERENCE.md
8. 07_FOLDER_STRUCTURE.md
9. 08_UI_FLOW.md
10. 09_DEVELOPMENT_GUIDE.md
11. 10_ROADMAP.md
12. 11_SECURITY_GUIDE.md
13. 12_AI_CONTEXT.md
14. 13_CODING_STANDARDS.md

Never skip the documentation.

---

# Development Workflow

Every feature must follow the same workflow.

```
Requirement

↓

Business Rules

↓

Database Design

↓

API Design

↓

DTO

↓

Controller

↓

Service

↓

Prisma

↓

Testing

↓

Documentation Update
```

No implementation should bypass this workflow.

---

# Before Writing Code

Before generating any code, verify the following:

- Understand the business requirement.
- Check the existing database schema.
- Review related API endpoints.
- Confirm security requirements.
- Follow coding standards.
- Reuse existing modules where possible.

Do not assume undocumented behavior.

---

# Project Rules

Always follow:

- Project Rules
- Business Rules
- API Convention
- Security Guide
- Coding Standards

If documents conflict:

Use the document with the lower number unless a newer revision explicitly overrides it.

---

# Backend Architecture

Every feature follows:

```
DTO

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL
```

Rules

Controller

- Receive Request
- Validate DTO
- Call Service

Service

- Business Logic
- Ownership Validation
- Authorization
- Database Operations

Prisma

- Data Access Only

---

# Frontend Architecture

Frontend responsibilities:

- UI Rendering
- Form Validation
- API Communication
- State Management
- User Experience

Never place business logic inside UI components.

---

# Security Requirements

Every feature must satisfy:

- Authentication
- Authorization
- Ownership Validation
- DTO Validation
- Proper Exception Handling
- Sensitive Data Protection

No feature is complete without passing the security checklist.

---

# API Requirements

Every API must:

- Follow REST conventions.
- Use proper HTTP methods.
- Return consistent response structures.
- Use appropriate HTTP status codes.
- Validate all incoming data.

---

# Database Requirements

Always:

- Use Prisma ORM.
- Use relations correctly.
- Select only required fields.
- Avoid duplicated calculated values.

Never modify the database schema without updating the documentation.

---

# Documentation Policy

Documentation must always stay synchronized with implementation.

Whenever a feature changes:

Update the relevant documents before merging code.

Possible updates include:

- Database Guide
- API Reference
- Business Rules
- Roadmap

---

# AI Operating Rules

AI assistants must:

- Follow existing architecture.
- Respect business rules.
- Generate production-ready code.
- Avoid duplicated logic.
- Explain architectural trade-offs.
- Ask for clarification when requirements are ambiguous.

AI assistants must never:

- Invent database fields.
- Ignore security requirements.
- Break API conventions.
- Change folder structure without instruction.
- Expose secrets or sensitive information.

---

# Definition of Done

A feature is complete only if:

- Database updated (if required)
- Migration completed
- DTO implemented
- Controller implemented
- Service implemented
- Security applied
- Ownership validated
- API tested
- Documentation updated
- Code reviewed

---

# Project Roadmap

Development should follow this order:

1. Authentication
2. User
3. Portfolio
4. Category
5. Investment
6. Transaction
7. Dashboard
8. Goal
9. Announcement
10. Notification
11. Activity Log
12. Admin Panel

Future features should extend the existing architecture rather than replace it.

---

# Final Reminder

This project follows a documentation-first development approach.

Before writing code:

Read.

Before changing architecture:

Read.

Before modifying business logic:

Read.

Documentation is the single source of truth.

When in doubt, consult the documentation before implementing any solution.
