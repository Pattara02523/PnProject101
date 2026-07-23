# 12 AI Context

# บริบทสำหรับ AI ที่ช่วยพัฒนาโปรเจกต์

## Purpose

ไฟล์นี้เป็น context หลักสำหรับ AI assistant ที่จะช่วยแก้โค้ดหรือเอกสารในโปรเจกต์นี้

AI ต้องอ่านไฟล์จริงก่อนแก้เสมอ

## Project Summary

ชื่อโปรเจกต์:

```txt
Investment Portfolio Management System
```

เป้าหมาย:

```txt
ระบบบริหารพอร์ตการลงทุน ติดตามสินทรัพย์ รายการซื้อขาย เป้าหมาย การแจ้งเตือน ประกาศ Dashboard และ Report Export
```

## Source of Truth

ใช้ลำดับอ้างอิงนี้:

1. ไฟล์โค้ดจริง
2. `api/prisma/schema.prisma`
3. `readme.md`
4. `docs/requirements/`
5. `docs/01-13`
6. repo ตัวอย่าง `earth824/dnc02-fakebuck-api` สำหรับ style ของ NestJS เท่านั้น

## Current Facts

ทำแล้ว:

- NestJS backend ใน `api/`
- Prisma schema
- DatabaseModule
- PrismaService
- ConfigModule
- Authentication with JWT and bcrypt
- User profile endpoints
- Portfolio CRUD with ownership and default portfolio rule

ยังไม่ทำ:

- Dashboard
- Report Export
- Frontend

## AI ต้องทำ

- ตอบภาษาไทยเมื่อ user ใช้ภาษาไทย
- อ่านไฟล์จริงก่อนแก้
- ใช้ schema จริง ไม่ invent field
- แยก planned กับ implemented ให้ชัด
- ทำ controller/service/dto ตาม pattern
- ตรวจ ownership สำหรับข้อมูล user
- update docs เมื่อแก้ code
- run verification ที่เหมาะสม

## AI ห้ามทำ

- ห้ามบอกว่า endpoint เสร็จแล้วถ้ายังไม่มี method
- ห้ามแก้ไฟล์ generated Prisma
- ห้าม expose password/token/secret
- ห้ามข้าม ownership validation
- ห้ามเพิ่ม dependency โดยไม่จำเป็น
- ห้ามเอา frontend ปนใน backend
- ห้ามคัด domain logic จาก Fakebuck เพราะโปรเจกต์นี้เป็น Investment Portfolio

## Backend Pattern

```txt
Controller
-> DTO
-> Service
-> PrismaService
-> PostgreSQL
```

## Feature Checklist

ก่อนถือว่า feature เสร็จ:

- DTO แล้ว
- Controller แล้ว
- Service แล้ว
- Prisma query แล้ว
- Auth/role/ownership แล้ว
- Error handling แล้ว
- Test หรือ API verification แล้ว
- Docs แล้ว

## Requirements ที่ต้องจำ

Personal Project ต้องมี:

- Full-stack app
- Auth
- Protected routes
- User/Admin roles
- CRUD อย่างน้อย 2 entities
- Core features อย่างน้อย 2 ฟีเจอร์
- Basic security

โปรเจกต์นี้ตั้งใจทำ:

- Portfolio CRUD
- Category CRUD
- Investment CRUD
- Transaction CRUD
- Search/Filter
- Dashboard
- Goal
- Notification
- Announcement
- Report Export
- Admin

## Communication Style

รายงานกับ user แบบสั้น ชัด และใช้งานต่อได้:

- แก้อะไร
- แก้ไฟล์ไหน
- verify อะไร
- มีอะไรยัง planned
