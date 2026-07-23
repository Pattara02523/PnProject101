# 01 Project Rules

# กฎหลักของโปรเจกต์ Investment Portfolio Management System

## ภาพรวมโปรเจกต์

โปรเจกต์นี้เป็นเว็บแอป Full-stack สำหรับบริหารและติดตามพอร์ตการลงทุนส่วนบุคคล ผู้ใช้สามารถสมัครสมาชิก เข้าสู่ระบบ จัดการพอร์ต บันทึกสินทรัพย์ บันทึกรายการซื้อขาย ติดตามเป้าหมาย ดู Dashboard วิเคราะห์ผลการลงทุน รับการแจ้งเตือน และอ่านประกาศจากผู้ดูแลระบบได้

เอกสารนี้อ้างอิงจาก:

- `readme.md`
- `docs/requirements/SRS_Investment_Tracker_Full.md`
- `docs/requirements/โจทย์ข้อกำหนด Personal Project.md`
- `api/prisma/schema.prisma`
- ตัวอย่างโครง NestJS API จาก `earth824/dnc02-fakebuck-api`

## สถานะปัจจุบันของโค้ด

ทำแล้ว:

- NestJS backend อยู่ใน `api/`
- Prisma schema อยู่ใน `api/prisma/schema.prisma`
- ใช้ PostgreSQL
- มี `DatabaseModule` และ `PrismaService`
- มี `ConfigModule` และไฟล์ตรวจ environment
- มี `AuthModule`, `AuthController`, `AuthService` แบบ stub

ยังไม่ได้ทำ:

- Register/Login ที่ทำงานจริง
- JWT guard และ role guard
- bcrypt password hashing
- User, Portfolio, Category, Investment, Transaction, Goal, Announcement, Notification, ActivityLog, Dashboard module
- Frontend Next.js
- Export Report

## Tech Stack

Backend:

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod
- pnpm

Frontend ที่วางแผน:

- Next.js
- React
- Tailwind CSS
- React Hook Form
- TanStack Query
- Recharts
- shadcn/ui

หมายเหตุ: requirements ระบุ `class-validator` ได้ แต่โค้ดและ README ปัจจุบันใช้แนวทาง `Zod` จึงให้ยึด `Zod` เป็นหลักจนกว่าจะเปลี่ยน dependency จริง

## กฎทั่วไป

- เอกสารต้องตรงกับโค้ดจริง
- ถ้าฟีเจอร์ยังไม่มี method ใน controller ให้ระบุว่า planned
- ห้ามเขียนว่า endpoint ทำเสร็จแล้วถ้ายังไม่มี implementation
- ใช้ feature-based architecture
- Controller รับ HTTP request เท่านั้น
- Service เป็นที่อยู่ของ business logic
- Database access ต้องผ่าน Prisma
- ทุกฟีเจอร์ที่เป็นข้อมูลส่วนตัวต้องตรวจ ownership

## โมเดลหลัก

โมเดลใน Prisma ปัจจุบัน:

- `User`
- `Portfolio`
- `Category`
- `Investment`
- `Transaction`
- `Goal`
- `Notification`
- `Announcement`
- `ActivityLog`

## กฎด้าน Authentication

- ต้องมี Sign-up และ Login
- ใช้ JWT หรือ token สำหรับยืนยันตัวตน
- Protected routes ต้อง require token
- Password ต้อง hash ก่อนบันทึก
- ห้ามส่ง `password` กลับไปใน API response
- ต้องมี role อย่างน้อย `USER` และ `ADMIN`

## กฎด้าน CRUD และ Core Features

ตาม requirements โปรเจกต์ต้องมี:

- Authentication
- CRUD อย่างน้อย 2 entities
- Core features อย่างน้อย 2 ฟีเจอร์ที่ไม่นับ Auth

โปรเจกต์นี้เลือกทำมากกว่า requirement ขั้นต่ำ ได้แก่ Portfolio, Category, Investment, Transaction, Goal, Notification, Announcement, Dashboard และ Admin

Core features สำคัญ:

- Search / Filter
- Dashboard analytics
- Notification
- Export Report planned

## กฎด้าน Security

- ใช้ JWT Authentication
- ใช้ Role-based Access Control
- ตรวจ ownership ก่อนเข้าถึงข้อมูลของผู้ใช้
- Validate request ทุกครั้ง
- ใช้ Prisma เพื่อลดความเสี่ยง SQL Injection
- ใช้ environment variables สำหรับข้อมูลสำคัญ

## Documentation Rule

ทุกครั้งที่แก้โค้ด ต้องอัปเดตเอกสารที่เกี่ยวข้อง:

- Database: `03_DATABASE_GUIDE.md`
- Business rules: `04_BUSINESS_RULES.md`
- API: `06_API_REFERENCE.md`
- Folder: `07_FOLDER_STRUCTURE.md`
- Security: `11_SECURITY_GUIDE.md`
- Roadmap: `10_ROADMAP.md`
