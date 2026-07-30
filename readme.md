# Investment Portfolio Management System

ระบบเว็บแอปแบบ Full-stack สำหรับบริหารพอร์ตการลงทุน บันทึกสินทรัพย์ รายการซื้อขาย เป้าหมายทางการเงิน การแจ้งเตือน ประกาศจากผู้ดูแลระบบ และ Dashboard วิเคราะห์ผลการลงทุน

โปรเจกต์นี้ใช้แนวทาง documentation-first คือให้เอกสารใน `docs/` เป็นแหล่งอ้างอิงหลักก่อนเริ่มเขียนฟีเจอร์

## ฟีเจอร์หลัก

Authentication:

- สมัครสมาชิก
- เข้าสู่ระบบ
- JWT Authentication
- Role-based Authorization
- User Profile
- Protected Routes

Portfolio:

- สร้างพอร์ต
- แก้ไขพอร์ต
- ลบพอร์ต
- รองรับหลายพอร์ตต่อผู้ใช้

Investment:

- จัดการสินทรัพย์
- จัดการหมวดหมู่
- ระดับความเสี่ยง
- สถานะการลงทุน
- ค้นหาและกรองข้อมูล

Transaction:

- Buy
- Sell
- Deposit
- Withdraw
- Dividend

Dashboard:

- มูลค่าพอร์ตรวม
- Asset Allocation
- Profit / Loss
- ROI
- Goal Progress
- Recent Transactions
- กราฟสรุปผลการลงทุน

Goals:

- สร้างเป้าหมายทางการเงิน
- ติดตามความคืบหน้า
- สถานะเป้าหมาย

Announcement:

- ประกาศระบบ
- ผู้ดูแลระบบเผยแพร่ประกาศ

Notification:

- แจ้งเตือนรายผู้ใช้
- Mark as Read

Administration:

- User Management
- Activity Logs
- Announcement Management

Planned:

- Export Report
- Frontend ด้วย Next.js

## Technology Stack

Backend:

- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod

Frontend:

- Next.js
- React
- Tailwind CSS
- React Hook Form
- TanStack Query
- Recharts
- shadcn/ui

Package Manager:

- pnpm

## โครงสร้างโปรเจกต์ปัจจุบัน

```txt
PNProject/
|-- api/
|-- docs/
|-- readme.md
```

Backend อยู่ใน:

```txt
api/
```

เอกสารโปรเจกต์อยู่ใน:

```txt
docs/
```

## เอกสารสำคัญ

```txt
docs/PROJECT_BOOTSTRAP.md
docs/01_PROJECT_RULES.md
docs/02_ARCHITECTURE.md
docs/03_DATABASE_GUIDE.md
docs/04_BUSINESS_RULES.md
docs/05_API_CONVENTION.md
docs/06_API_REFERENCE.md
docs/07_FOLDER_STRUCTURE.md
docs/08_UI_FLOW.md
docs/09_DEVELOPMENT_GUIDE.md
docs/10_ROADMAP.md
docs/11_SECURITY_GUIDE.md
docs/12_AI_CONTEXT.md
docs/13_CODING_STANDARDS.md
docs/14_FRONTEND_TODO.md
```

Requirements อยู่ใน:

```txt
docs/requirements/
```

## เริ่มต้นใช้งาน Backend

เข้าโฟลเดอร์ backend:

```bash
cd api
```

ติดตั้ง dependencies:

```bash
pnpm install
```

สร้างไฟล์ `.env`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=3000
```

รัน migration:

```bash
pnpm prisma migrate dev
```

generate Prisma client:

```bash
pnpm prisma generate
```

เริ่ม development server:

```bash
pnpm start:dev
```

## Development Workflow

ทุกฟีเจอร์ควรทำตามลำดับนี้:

```txt
Requirement
-> Business Rules
-> Database
-> API
-> DTO
-> Controller
-> Service
-> Testing
-> Documentation
```

## สถานะโปรเจกต์

```txt
In Development
```

ปัจจุบันมี backend foundation, Prisma schema, DatabaseModule, ConfigModule และ Auth module stub แล้ว แต่ endpoint หลักยังอยู่ในสถานะ planned

## Author

**BP Lemon**

Full-stack Developer
