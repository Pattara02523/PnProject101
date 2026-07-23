# 09 Development Guide

# คู่มือการพัฒนา

## ภาพรวม

ทุก feature ต้องเริ่มจาก requirements และ docs ก่อนลงมือเขียน code เพื่อให้ระบบตรงโจทย์ Personal Project และ SRS

## คำสั่งพื้นฐาน

เข้า backend:

```bash
cd api
```

ติดตั้ง dependencies:

```bash
pnpm install
```

รัน dev:

```bash
pnpm start:dev
```

Build:

```bash
pnpm build
```

Test:

```bash
pnpm test
pnpm test:e2e
```

ถ้า PowerShell block script ให้ใช้:

```bash
pnpm.cmd build
pnpm.cmd test
pnpm.cmd start:dev
```

## Workflow ต่อ Feature

```txt
Requirement
-> Business Rules
-> Database
-> DTO
-> Service
-> Controller
-> Module wiring
-> Test/API verification
-> Documentation
```

## ก่อนเขียนโค้ด

อ่าน:

- `readme.md`
- `docs/requirements/`
- `01_PROJECT_RULES.md`
- `03_DATABASE_GUIDE.md`
- `04_BUSINESS_RULES.md`
- `06_API_REFERENCE.md`
- `11_SECURITY_GUIDE.md`

## การเช็ค Database

ดู:

```txt
api/prisma/schema.prisma
```

ถามตัวเอง:

- model มีแล้วหรือยัง
- enum ตรงไหม
- relation มีไหม
- ต้อง migrate ไหม

ถ้าแก้ schema:

```bash
pnpm prisma migrate dev --name feature_name
pnpm prisma generate
```

## การสร้าง Module

ตัวอย่าง:

```bash
nest g module portfolio
nest g controller portfolio
nest g service portfolio
```

เก็บใน:

```txt
api/src/<feature>/
```

## DTO

DTO ใช้กำหนด request shape และ validation ห้ามใส่ business logic

ตัวอย่าง:

```txt
create-portfolio.dto.ts
update-portfolio.dto.ts
portfolio-response.dto.ts
```

## Service

Service ต้อง:

- ทำ business rule
- ตรวจ ownership
- เรียก Prisma
- เลือก field ที่ปลอดภัย
- throw NestJS exception

## Controller

Controller ต้อง:

- กำหนด route
- รับ DTO/params/query
- เรียก service
- คืน response

Controller ห้าม query database เอง

## Verification

ขั้นต่ำหลังแก้ backend:

```bash
pnpm build
```

ถ้ามี behavior:

```bash
pnpm test
pnpm test:e2e
```

หรือทดสอบ API ด้วย Postman/Bruno/Insomnia/curl

## ลำดับการพัฒนาที่แนะนำ

1. Auth
2. User
3. Portfolio
4. Category
5. Investment
6. Transaction
7. Search / Filter
8. Goal
9. Dashboard
10. Notification
11. Announcement
12. Report Export
13. Admin
14. Frontend

## Definition of Done

Feature จะถือว่าเสร็จเมื่อ:

- code ทำงานจริง
- DTO validation มีแล้ว
- ownership ตรวจแล้ว
- role rule ตรวจแล้วถ้าต้องใช้
- API verify แล้ว
- build ผ่าน
- docs อัปเดตแล้ว
