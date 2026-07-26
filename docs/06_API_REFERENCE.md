# 06 API Reference

# เอกสาร API และ Endpoint Matrix

เอกสารนี้สรุป endpoint จาก SRS ของโปรเจกต์ Investment Portfolio Management System ในรูปแบบตารางเหมือน checklist สำหรับพัฒนาและทดสอบผ่าน Postman

## สถานะ

- `[implemented]`: มี controller/service แล้วและ build ผ่าน
- `[planned]`: อยู่ใน SRS/docs แต่ยังไม่ได้เขียนโค้ด

## Current Base URL

```txt
http://localhost:8000
```

หมายเหตุ: ตอนนี้ยังไม่ได้ตั้ง global prefix `/api/v1` ดังนั้น endpoint ใช้ตรงจาก controller เช่น `/auth/login`

## API Endpoint Matrix

| Feature | End Point | Module | Controller | Body (application/json) | Authentication | Success Response | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Register | `POST /auth/register` | Auth | Auth | `firstname`, `lastname`, `email`, `password`, `phone?` | Public | `message` | `[implemented]` |
| Login | `POST /auth/login` | Auth | Auth | `email`, `password` | Public | `access_token`, `user` | `[implemented]` |
| Get authenticated user | `GET /auth/me` | Auth | Auth | - | Bearer Auth | `user` | `[implemented]` |
| Get profile | `GET /users/profile` | User | User | - | Bearer Auth | `user` | `[implemented]` |
| Update profile | `PATCH /users/profile` | User | User | `firstname?`, `lastname?`, `phone?` | Bearer Auth | `user` | `[implemented]` |
| Change password | `PATCH /users/password` | User | User | `oldPassword`, `newPassword` | Bearer Auth | `message` | `[implemented]` |
| Upload avatar | `PATCH /users/avatar` | User | User | `avatar` multipart/form-data | Bearer Auth | `avatarUrl` | `[planned]` |
| Create portfolio | `POST /portfolios` | Portfolio | Portfolio | `name`, `description?`, `color?`, `icon?`, `isFavorite?`, `isDefault?` | Bearer Auth | `portfolio` | `[implemented]` |
| List portfolios | `GET /portfolios` | Portfolio | Portfolio | - | Bearer Auth | `Portfolio[]` | `[implemented]` |
| Get portfolio by id | `GET /portfolios/:id` | Portfolio | Portfolio | - | Bearer Auth | `portfolio` | `[implemented]` |
| Update portfolio | `PATCH /portfolios/:id` | Portfolio | Portfolio | `name?`, `description?`, `color?`, `icon?`, `isFavorite?`, `isDefault?` | Bearer Auth | `portfolio` | `[implemented]` |
| Delete portfolio | `DELETE /portfolios/:id` | Portfolio | Portfolio | - | Bearer Auth | `message` | `[implemented]` |
| Create category | `POST /categories` | Category | Category | `name`, `icon?`, `color?`, `description?`, `isDefault?` | Bearer Auth | `category` | `[implemented]` |
| List categories | `GET /categories` | Category | Category | - | Bearer Auth | `Category[]` | `[implemented]` |
| Update category | `PATCH /categories/:id` | Category | Category | `name?`, `icon?`, `color?`, `description?`, `isDefault?` | Bearer Auth | `category` | `[implemented]` |
| Delete category | `DELETE /categories/:id` | Category | Category | - | Bearer Auth | `message` | `[implemented]` |
| Create investment | `POST /investments` | Investment | Investment | `portfolioId`, `categoryId`, `assetName`, `symbol`, `assetType`, `purchasePrice`, `currentPrice`, `quantity`, `averageCost`, `riskLevel`, `investmentDate`, `note?` | Bearer Auth | `investment` | `[implemented]` |
| List investments | `GET /investments` | Investment | Investment | Query: `page?`, `limit?`, `search?`, `portfolioId?`, `categoryId?`, `assetType?`, `riskLevel?`, `status?`, `dateFrom?`, `dateTo?` | Bearer Auth | `Investment[]`, `pagination` | `[implemented]` |
| Get investment by id | `GET /investments/:id` | Investment | Investment | - | Bearer Auth | `investment` | `[implemented]` |
| Update investment | `PATCH /investments/:id` | Investment | Investment | investment fields optional | Bearer Auth | `investment` | `[implemented]` |
| Delete investment | `DELETE /investments/:id` | Investment | Investment | - | Bearer Auth | `message` | `[implemented]` |
| Create transaction | `POST /transactions` | Transaction | Transaction | `investmentId`, `type`, `quantity?`, `price?`, `amount`, `fee?`, `tax?`, `transactionDate`, `note?` | Bearer Auth | `transaction` | `[implemented]` |
| List transactions | `GET /transactions` | Transaction | Transaction | Query: `investmentId?`, `type?`, `dateFrom?`, `dateTo?` | Bearer Auth | `Transaction[]`, `pagination` | `[implemented]` |
| Get transaction by id | `GET /transactions/:id` | Transaction | Transaction | - | Bearer Auth | `transaction` | `[implemented]` |
| Update transaction | `PATCH /transactions/:id` | Transaction | Transaction | transaction fields optional | Bearer Auth | `transaction` | `[implemented]` |
| Delete transaction | `DELETE /transactions/:id` | Transaction | Transaction | - | Bearer Auth | `message` | `[implemented]` |
| Create goal | `POST /goals` | Goal | Goal | `title`, `description?`, `targetAmount`, `currentAmount`, `deadline`, `status?` | Bearer Auth | `goal` | `[implemented]` |
| List goals | `GET /goals` | Goal | Goal | - | Bearer Auth | `Goal[]` | `[implemented]` |
| Get goal by id | `GET /goals/:id` | Goal | Goal | - | Bearer Auth | `goal` | `[implemented]` |
| Update goal | `PATCH /goals/:id` | Goal | Goal | goal fields optional | Bearer Auth | `goal` | `[implemented]` |
| Delete goal | `DELETE /goals/:id` | Goal | Goal | - | Bearer Auth | `message` | `[implemented]` |
| Dashboard summary | `GET /dashboard` | Dashboard | Dashboard | - | Bearer Auth | `summary`, `charts`, `recentTransactions` | `[implemented]` |
| Create notification (Admin) | `POST /notifications` | Notification | Notification | `userId`, `title`, `message`, `type?` | Bearer Auth + Admin | `notification` | `[implemented]` |
| List notifications | `GET /notifications` | Notification | Notification | - | Bearer Auth | `Notification[]` | `[implemented]` |
| Mark notification as read | `PATCH /notifications/:id/read` | Notification | Notification | - | Bearer Auth | `notification` | `[implemented]` |
| Delete notification | `DELETE /notifications/:id` | Notification | Notification | - | Bearer Auth | `message` | `[implemented]` |
| List announcements | `GET /announcements` | Announcement | Announcement | - | Public or Bearer Auth | `Announcement[]` | `[implemented]` |
| Get announcement by id | `GET /announcements/:id` | Announcement | Announcement | - | Public or Bearer Auth | `announcement` | `[implemented]` |
| List all announcements (Admin) | `GET /admin/announcements` | Announcement | Announcement | - | Bearer Auth + Admin | `Announcement[]` | `[implemented]` |
| Create announcement | `POST /admin/announcements` | Announcement | Announcement | `title`, `message`, `type`, `imageUrl?`, `isPublished?` | Bearer Auth + Admin | `announcement` | `[implemented]` |
| Update announcement | `PATCH /admin/announcements/:id` | Announcement | Announcement | announcement fields optional | Bearer Auth + Admin | `announcement` | `[implemented]` |
| Delete announcement | `DELETE /admin/announcements/:id` | Announcement | Announcement | - | Bearer Auth + Admin | `message` | `[implemented]` |
| Export portfolio report | `GET /reports/portfolio` | Report | Report | Query: `portfolioId?`, `dateFrom?`, `dateTo?` | Bearer Auth | CSV file download | `[implemented]` |
| Export portfolio report PDF | `GET /reports/portfolio/pdf` | Report | Report | Query: `portfolioId?`, `dateFrom?`, `dateTo?` | Bearer Auth | PDF file download | `[implemented]` |
| Export transaction report | `GET /reports/transactions` | Report | Report | Query: `portfolioId?`, `dateFrom?`, `dateTo?` | Bearer Auth | CSV file download | `[implemented]` |
| Export transaction report PDF | `GET /reports/transactions/pdf` | Report | Report | Query: `portfolioId?`, `dateFrom?`, `dateTo?` | Bearer Auth | PDF file download | `[implemented]` |
| Admin Dashboard | `GET /admin/dashboard` | Admin | Admin | - | Bearer Auth + Admin | `summary` | `[implemented]` |
| List users | `GET /admin/users` | Admin | Admin | Query: `page?`, `limit?`, `search?`, `status?` | Bearer Auth + Admin | `User[]`, `pagination` | `[implemented]` |
| Get user by id | `GET /admin/users/:id` | Admin | Admin | - | Bearer Auth + Admin | `user` | `[implemented]` |
| Update user status | `PATCH /admin/users/:id/status` | Admin | Admin | `status` | Bearer Auth + Admin | `user` | `[implemented]` |
| Delete user | `DELETE /admin/users/:id` | Admin | Admin | - | Bearer Auth + Admin | `message` | `[implemented]` |
| View activity logs | `GET /admin/activity-logs` | Admin | Admin | Query: `page?`, `limit?`, `userId?`, `action?`, `module?` | Bearer Auth + Admin | `ActivityLog[]`, `pagination` | `[implemented]` |

## Auth Request Examples

Register:

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "0812345678"
}
```

Login:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Get authenticated user:

```txt
GET /auth/me
Authorization: Bearer <access_token>
```

## Module Development Order

ถ้าทำตาม SRS และ roadmap แนะนำเรียงแบบนี้:

```txt
Auth
-> User
-> Portfolio
-> Category
-> Investment
-> Transaction
-> Dashboard
-> Goal
-> Notification
-> Announcement
-> Report
-> Admin
```

เหตุผลคือ `Portfolio`, `Category`, `Investment`, และ `Transaction` เป็นแกนข้อมูลหลัก ส่วน Dashboard/Report ต้องรอข้อมูลเหล่านี้ก่อนจึงจะคำนวณได้
