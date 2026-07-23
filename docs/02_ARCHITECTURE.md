# 02 Architecture

# สถาปัตยกรรมระบบ

## ภาพรวม

ระบบใช้สถาปัตยกรรมแบบ Feature-Based Architecture บน NestJS โดยยึดรูปแบบ backend คล้ายตัวอย่าง `earth824/dnc02-fakebuck-api`: มี `src`, `prisma`, `test`, `package.json`, `pnpm` และแยกงานเป็น module ตามฟีเจอร์

## โครงสร้างการทำงานปัจจุบัน

```txt
main.ts
-> AppModule
-> ConfigModule
-> DatabaseModule
-> AuthModule
```

`main.ts` เปิด server ที่ `process.env.PORT` หรือ `3000`

`AppModule` ปัจจุบัน import:

- `ConfigModule`
- `DatabaseModule`
- `AuthModule`

## Flow เป้าหมายของ API

```txt
Client
-> Controller
-> DTO Validation
-> Service
-> PrismaService
-> PostgreSQL
-> Response
```

## หน้าที่ของแต่ละ Layer

Controller:

- รับ HTTP request
- รับ body, params, query
- เรียก service
- ส่ง response

Controller ห้าม:

- Query Prisma โดยตรง
- ใส่ business logic
- ตรวจ ownership เองแบบกระจัดกระจาย

Service:

- ทำ business logic
- ตรวจ ownership
- ตรวจ rule ที่เกี่ยวกับ role/permission
- เรียก Prisma
- คืนข้อมูลที่ปลอดภัย

Prisma:

- จัดการ database query
- จัดการ relation
- ใช้ transaction เมื่อจำเป็น

## Modules

มีแล้ว:

- `auth`
- `database`
- `config`

วางแผน:

- `user`
- `portfolio`
- `category`
- `investment`
- `transaction`
- `goal`
- `announcement`
- `notification`
- `activity-log`
- `dashboard`
- `report`
- `admin`

## ขอบเขตของข้อมูล

ข้อมูลที่เป็นของผู้ใช้:

```txt
User
-> Portfolio
-> Investment
-> Transaction
```

```txt
User
-> Category
```

```txt
User
-> Goal
```

```txt
User
-> Notification
```

```txt
User
-> ActivityLog
```

ข้อมูล global:

```txt
Announcement
```

## Auth Flow เป้าหมาย

Register:

```txt
Validate DTO
-> Check duplicate email
-> Hash password
-> Create user
-> Return safe user data
```

Login:

```txt
Validate DTO
-> Find user by email
-> Verify password
-> Sign JWT
-> Return access token
```

## Dashboard Flow

```txt
Authenticated user
-> DashboardController
-> DashboardService
-> Query portfolios/investments/transactions/goals
-> Calculate total value, profit/loss, ROI, allocation
-> Return summary and chart data
```

Dashboard ต้องคำนวณจากข้อมูลจริง ไม่เก็บค่ารวมซ้ำใน database

## หลักการออกแบบ

- แยก module ตาม feature
- Controller บางและอ่านง่าย
- Service เป็นที่รวม business rule
- Prisma เป็นที่เข้าถึง database
- DTO เป็นสัญญาของ request
- Guard ป้องกัน private/admin routes
- เอกสารต้อง sync กับโค้ดเสมอ
