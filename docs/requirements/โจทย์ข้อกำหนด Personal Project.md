# ข้อกำหนด Personal Project

ตำแหน่ง: Full-stack Developer (Next.js & NestJS)

## 1. วัตถุประสงค์

โปรเจกต์นี้มีเป้าหมายเพื่อทดสอบทักษะการพัฒนาเว็บแอปแบบ Full-stack โดยเน้น:

- การออกแบบโครงสร้างระบบ
- การจัดการข้อมูล
- ความปลอดภัยเบื้องต้น
- การทำงานร่วมกันระหว่าง Frontend, Backend และ Database

## 2. เทคโนโลยีที่ใช้

- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- ORM: Prisma

## 3. ขอบเขตงานและเกณฑ์การผ่าน

### 3.1 Authentication

ระบบต้องมี:

- สมัครสมาชิก
- เข้าสู่ระบบ
- ใช้ Session หรือ Token เช่น JWT
- Protected Routes สำหรับหน้าหรือ API ที่ต้อง login ก่อน
- มีอย่างน้อย 2 roles ได้แก่ `USER` และ `ADMIN`

### 3.2 CRUD Operations

ระบบต้องมี CRUD อย่างน้อย 2 ชุดข้อมูล

โปรเจกต์นี้เลือกทำมากกว่า requirement ขั้นต่ำ ได้แก่:

- Portfolio
- Category
- Investment
- Transaction
- Goal
- Notification
- Announcement

### 3.3 Core Features

ต้องมี core features อย่างน้อย 2 ฟีเจอร์ โดยไม่นับ Authentication

โปรเจกต์นี้เลือกทำ:

- Search / Filter
- Dashboard Analytics
- Notification
- Report Export
- Admin Management

## 4. Requirement Mapping ของโปรเจกต์นี้

Authentication:

- Register
- Login
- JWT Authentication
- Protected API
- User/Admin roles

Data Management:

- Portfolio CRUD
- Category CRUD
- Investment CRUD
- Transaction CRUD
- Goal CRUD

Core Features:

- ค้นหาและกรองรายการลงทุน
- Dashboard สรุปมูลค่า กำไร/ขาดทุน ROI และกราฟ
- แจ้งเตือนผู้ใช้
- Export report

Security:

- Password hashing
- JWT
- Role-based access
- Ownership validation
- DTO validation
- Prisma ORM

## 5. เกณฑ์ส่งงาน

โปรเจกต์ควรมี:

- โครงสร้าง code ชัดเจน
- Database schema สอดคล้องกับ feature
- API ทำงานได้จริง
- Authentication ใช้งานได้จริง
- CRUD อย่างน้อย 2 entities
- Core features อย่างน้อย 2 ฟีเจอร์
- เอกสารอธิบายระบบ
- README สำหรับเริ่มต้นใช้งาน
