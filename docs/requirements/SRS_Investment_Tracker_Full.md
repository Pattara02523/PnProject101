# Software Requirements Specification (SRS)

# Investment Portfolio Management System

ตำแหน่งอ้างอิง: Full-stack Developer (Next.js & NestJS)

## 1. บทนำ

### 1.1 วัตถุประสงค์

เอกสารนี้กำหนดความต้องการของระบบ Investment Portfolio Management System ซึ่งเป็นเว็บแอปสำหรับช่วยให้ผู้ใช้บริหาร จัดเก็บ และติดตามข้อมูลการลงทุนของตนเองอย่างเป็นระบบ ผู้ใช้สามารถวิเคราะห์ผลตอบแทน ตรวจสอบกำไร/ขาดทุน และติดตามเป้าหมายการลงทุนผ่าน Dashboard ได้

### 1.2 ขอบเขตระบบ

ระบบครอบคลุม:

- สมัครสมาชิกและเข้าสู่ระบบ
- จัดการพอร์ตการลงทุน
- จัดการหมวดหมู่การลงทุน
- บันทึกรายการลงทุน
- บันทึกรายการซื้อขาย
- ค้นหา กรอง และเรียงข้อมูล
- Dashboard วิเคราะห์ผลการลงทุน
- ติดตามเป้าหมายการลงทุน
- แจ้งเตือนผู้ใช้
- ประกาศจากผู้ดูแลระบบ
- Export Report
- ระบบผู้ดูแลระบบ

## 2. เทคโนโลยีที่ใช้

Frontend:

- Next.js
- React
- Tailwind CSS
- React Hook Form
- TanStack Query
- Recharts
- shadcn/ui

Backend:

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod

Package Manager:

- pnpm

## 3. User Roles

### User

User สามารถ:

- สมัครสมาชิก
- เข้าสู่ระบบ
- จัดการพอร์ตของตนเอง
- เพิ่ม แก้ไข ลบ รายการลงทุนของตนเอง
- บันทึกประวัติการซื้อขาย
- จัดการหมวดหมู่ของตนเอง
- ดู Dashboard และรายงาน
- ตั้งเป้าหมายการลงทุน
- รับการแจ้งเตือน
- Export report ของตนเอง

### Admin

Admin สามารถ:

- ดูข้อมูลผู้ใช้
- จัดการสถานะบัญชีผู้ใช้
- ดูภาพรวมระบบ
- ดู Activity Log
- จัดการประกาศ

## 4. Functional Requirements

### 4.1 Authentication

ระบบต้องรองรับ:

- Sign-up
- Login
- Logout
- JWT Authentication
- Protected Routes
- Change Password
- Update Profile
- Role-based Access Control

### 4.2 Portfolio

ระบบต้องรองรับ:

- สร้างพอร์ต เช่น พอร์ตหุ้น พอร์ตกองทุน พอร์ตคริปโต
- ดูรายการพอร์ตทั้งหมดของผู้ใช้
- แก้ไขชื่อ รายละเอียด สี icon และสถานะ favorite/default
- ลบพอร์ตของผู้ใช้

### 4.3 Category

ระบบต้องรองรับ:

- สร้างหมวดหมู่ เช่น หุ้น, ETF, กองทุน, คริปโต, ทองคำ
- ดูรายการหมวดหมู่ของผู้ใช้
- แก้ไขชื่อ สี icon และรายละเอียด
- ลบหมวดหมู่ที่ไม่ได้ถูกใช้งาน

### 4.4 Investment

ระบบต้องรองรับ:

- เพิ่มรายการลงทุน
- ระบุชื่อสินทรัพย์
- ระบุ symbol
- ระบุประเภทสินทรัพย์
- ระบุราคาซื้อ ราคาปัจจุบัน จำนวนหน่วย และวันที่ลงทุน
- ระบุระดับความเสี่ยง
- ระบุหมวดหมู่
- ดูรายละเอียดรายการลงทุน
- แก้ไขรายการลงทุน
- อัปเดตราคาปัจจุบัน
- เปลี่ยนสถานะการลงทุน
- ลบรายการลงทุน

### 4.5 Transaction

ระบบต้องรองรับ:

- Buy
- Sell
- Dividend
- Deposit
- Withdraw
- ดูประวัติรายการทั้งหมด
- กรองรายการตาม investment, type และช่วงวันที่

### 4.6 Goal

ระบบต้องรองรับ:

- สร้างเป้าหมายการลงทุน
- ดูรายการเป้าหมาย
- แก้ไขเป้าหมายและยอดเงินปัจจุบัน
- ลบเป้าหมาย
- แสดงความคืบหน้า

### 4.7 Search และ Filter

ระบบต้องค้นหาและกรองตาม:

- ชื่อสินทรัพย์
- ประเภทสินทรัพย์
- หมวดหมู่
- ระดับความเสี่ยง
- วันที่ลงทุน
- สถานะการลงทุน
- ช่วงกำไร/ขาดทุน

ระบบต้องเรียงข้อมูลตาม:

- วันที่
- จำนวนเงิน
- ROI
- กำไร
- ชื่อสินทรัพย์

### 4.8 Dashboard

Dashboard ต้องแสดง:

- มูลค่าพอร์ตการลงทุนรวม
- เงินลงทุนทั้งหมด
- กำไร/ขาดทุนรวม
- ROI
- จำนวนสินทรัพย์ทั้งหมด
- จำนวนพอร์ตทั้งหมด
- เป้าหมายที่กำลังดำเนินการ
- รายการซื้อขายล่าสุด

กราฟที่ต้องรองรับ:

- Portfolio Growth แบบ Line Chart
- Asset Allocation แบบ Pie Chart
- Monthly Investment แบบ Bar Chart

### 4.9 Notification

ระบบต้องแจ้งเตือนเมื่อ:

- เป้าหมายใกล้สำเร็จ
- ไม่มีการอัปเดตราคาการลงทุนเป็นเวลานาน
- มี reminder สำคัญ
- มีรายการใหม่หรือประกาศใหม่จากระบบ

### 4.10 Announcement

ระบบต้องรองรับ:

- Admin สร้างประกาศ
- Admin แก้ไขประกาศ
- Admin publish/unpublish
- User อ่านประกาศที่เผยแพร่แล้ว

### 4.11 Export Report

ระบบควรรองรับ:

- Export portfolio report
- Export transaction report
- เลือกช่วงวันที่
- เลือกรูปแบบไฟล์ เช่น CSV หรือ PDF

## 5. Security Requirements

ระบบต้องมี:

- Password hashing ด้วย bcrypt
- JWT Authentication
- Role-based Access Control
- Protected APIs
- DTO validation
- Ownership validation
- Prisma ORM เพื่อลดความเสี่ยง SQL Injection
- Environment variables สำหรับข้อมูลสำคัญ

## 6. Usability Requirements

ระบบควรรองรับ:

- Responsive Design ทั้ง Desktop และ Mobile
- Dark Mode และ Light Mode
- UI ใช้งานง่าย
- Pagination
- Search และ Filter
- Loading Skeleton
- Toast Notification
- Empty State
- Error State
- Navigation ที่ชัดเจน

## 7. Performance Requirements

ระบบควรรองรับ:

- ผู้ใช้หลายคนพร้อมกัน
- Dashboard โหลดข้อมูลภายในเวลาที่เหมาะสม
- ข้อมูลการลงทุนจำนวนมาก
- การขยายระบบในอนาคต
