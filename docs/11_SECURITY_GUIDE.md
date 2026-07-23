# 11 Security Guide

# คู่มือความปลอดภัย

## ภาพรวม

requirements ระบุว่าระบบต้องมี Basic Security ได้แก่ Authentication, Protected Routes, Roles, Data Validation และการป้องกัน SQL Injection ผ่าน ORM

## สถานะปัจจุบัน

ทำแล้ว:

- ใช้ Prisma แทน raw SQL
- มี ConfigModule
- มี env validation file

ยังไม่ทำ:

- bcrypt
- JWT guard
- roles guard
- ownership helper
- rate limit
- CORS config

## Authentication

ระบบต้องใช้ JWT

กฎ:

- `JWT_SECRET` ต้องอยู่ใน `.env`
- ห้าม hardcode secret
- token หมดอายุต้องถูก reject
- token ไม่ถูกต้องคืน `401 Unauthorized`
- private route ต้องใช้ JWT guard

## Password

- hash password ด้วย bcrypt
- salt rounds อย่างน้อย 10
- ห้ามเก็บ plain text password
- ห้าม return password
- ห้าม log password/password hash

## Roles

Role ที่ต้องมี:

- `USER`
- `ADMIN`

Admin endpoints ต้องใช้:

```txt
JwtAuthGuard
RolesGuard
```

## Ownership

ทุกข้อมูลที่เป็นของ user ต้องตรวจ owner

ตัวอย่าง:

```txt
Portfolio.userId === authenticatedUser.id
```

```txt
Investment.portfolio.userId === authenticatedUser.id
```

```txt
Transaction.investment.portfolio.userId === authenticatedUser.id
```

## Validation

ต้อง validate:

- required fields
- email
- UUID
- enum
- string length
- numeric range
- date

โปรเจกต์ปัจจุบันเลือกใช้ Zod ตาม README/package แต่ถ้าจะใช้ class-validator ต้องติดตั้ง dependency และแก้ convention ให้ตรงกันก่อน

## SQL Injection

ใช้ Prisma query method เป็นหลัก

ห้ามต่อ SQL string เอง

Raw SQL ใช้ได้เมื่อจำเป็น และต้อง parameterized

## Data Exposure

ห้ามเปิดเผย:

- password
- JWT
- secret
- DATABASE_URL
- API keys

ใช้ Prisma `select` เพื่อคืนเฉพาะ field ที่จำเป็น

## File Upload

สำหรับ avatar/announcement image ในอนาคต:

- ตรวจ MIME type
- ตรวจ file size
- ตั้งชื่อไฟล์ใหม่
- เก็บเฉพาะ URL/path ใน database
- ห้ามรับ executable file

ประเภทที่รับ:

- jpg
- jpeg
- png
- webp

## CORS

Development เปิดเฉพาะ local frontend ที่ใช้จริง

Production เปิดเฉพาะ domain ที่เชื่อถือได้

## Rate Limit

แนะนำ:

- Login: 5 requests/minute
- Register: 5 requests/minute
- Change password: 3 requests/hour

## Activity Log

ควร log:

- REGISTER
- LOGIN
- LOGOUT
- CREATE
- UPDATE
- DELETE

ห้าม log:

- password
- token
- secret
- request body ที่มีข้อมูลอ่อนไหว

## Production Checklist

- [ ] JWT secret configured
- [ ] Password hashing
- [ ] JWT guard
- [ ] Roles guard
- [ ] Ownership validation
- [ ] DTO validation
- [ ] CORS restricted
- [ ] Rate limiting
- [ ] Sanitized errors
- [ ] Dependency audit
- [ ] HTTPS
