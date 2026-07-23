# 03 Database Guide

# คู่มือฐานข้อมูล

## ภาพรวม

ระบบใช้ PostgreSQL และ Prisma ORM โดย schema หลักอยู่ที่:

```txt
api/prisma/schema.prisma
```

Prisma client ถูก generate ไปที่:

```txt
api/src/database/generated/prisma
```

ห้ามแก้ไฟล์ generated ด้วยมือ

## Entity Relationship

```txt
User
|-- Portfolio
|   |-- Investment
|       |-- Transaction
|-- Category
|   |-- Investment
|-- Goal
|-- Notification
|-- ActivityLog

Announcement
```

`Announcement` เป็นข้อมูลสาธารณะ ไม่ผูกกับ user

## User

Table: `users`

ใช้เก็บ:

- ข้อมูลบัญชี
- email/password
- role
- status
- profile

กฎสำคัญ:

- email ต้อง unique
- password ต้อง hash
- ห้ามส่ง password ออก API
- `deletedAt` ใช้รองรับ soft delete

## Portfolio

Table: `portfolios`

ใช้เก็บพอร์ตการลงทุนของผู้ใช้

กฎสำคัญ:

- Portfolio เป็นของ user คนเดียว
- User มีหลาย portfolio ได้
- Portfolio มีหลาย investment ได้
- ลบ user จะลบ portfolio ต่อด้วย cascade
- ลบ portfolio จะลบ investment ต่อด้วย cascade

## Category

Table: `categories`

ใช้จัดหมวดหมู่การลงทุน เช่น หุ้น, ETF, กองทุน, คริปโต, ทองคำ

กฎสำคัญ:

- Category เป็นของ user
- ใช้ร่วมกับทุก portfolio ของ user คนนั้นได้
- ลบ category ไม่ได้ถ้ายังมี investment ใช้อยู่

## Investment

Table: `investments`

ใช้เก็บสินทรัพย์การลงทุน

field สำคัญ:

- `assetName`
- `symbol`
- `assetType`
- `purchasePrice`
- `currentPrice`
- `quantity`
- `averageCost`
- `riskLevel`
- `status`
- `investmentDate`

กฎสำคัญ:

- Investment ต้องอยู่ใน portfolio
- Investment ต้องมี category
- Profit/Loss, ROI, allocation ให้คำนวณใน service
- `averageCost` มีใน schema แล้ว service ต้องอัปเดตให้ถูกเมื่อทำ transaction logic

## Transaction

Table: `transactions`

ใช้เก็บประวัติการซื้อขายและกระแสเงิน

ประเภท:

- `BUY`
- `SELL`
- `DIVIDEND`
- `DEPOSIT`
- `WITHDRAW`

กฎสำคัญ:

- Transaction เป็นของ investment
- ควรถือเป็น historical record
- ถ้าต้องแก้ข้อมูลย้อนหลัง ควรมี correction policy ชัดเจน

## Goal

Table: `goals`

ใช้ติดตามเป้าหมายทางการเงิน

กฎสำคัญ:

- Goal เป็นของ user
- `targetAmount` ต้องมากกว่า 0
- `currentAmount` ห้ามติดลบ
- status ได้แก่ `IN_PROGRESS`, `COMPLETED`, `FAILED`

## Notification

Table: `notifications`

ใช้แจ้งเตือนรายผู้ใช้ เช่น goal ใกล้สำเร็จ, investment reminder, system reminder

กฎสำคัญ:

- Notification เป็นของ user
- มี `isRead`
- User อ่านของคนอื่นไม่ได้

## Announcement

Table: `announcements`

ใช้เก็บประกาศสาธารณะ เช่น news, maintenance, market, system

กฎสำคัญ:

- Admin เป็นผู้จัดการ
- ผู้ใช้เห็นเฉพาะที่ published
- ไม่ใช่ notification ส่วนตัว

## ActivityLog

Table: `activity_logs`

ใช้บันทึก action สำคัญ:

- `LOGIN`
- `LOGOUT`
- `REGISTER`
- `CREATE`
- `UPDATE`
- `DELETE`

ห้าม log password, token, secret

## Enums ปัจจุบัน

```txt
UserRole: USER, ADMIN
UserStatus: ACTIVE, SUSPENDED, DELETED
AssetType: STOCK, ETF, FUND, CRYPTO, GOLD, BOND
RiskLevel: LOW, MEDIUM, HIGH
InvestmentStatus: ACTIVE, SOLD
TransactionType: BUY, SELL, DIVIDEND, DEPOSIT, WITHDRAW
GoalStatus: IN_PROGRESS, COMPLETED, FAILED
NotificationType: GOAL, INVESTMENT, REMINDER
ActivityAction: LOGIN, LOGOUT, REGISTER, CREATE, UPDATE, DELETE
AnnouncementType: NEWS, MAINTENANCE, MARKET, SYSTEM
```

## ข้อมูลที่ไม่ควรเก็บซ้ำ

ควรคำนวณจากข้อมูลจริง:

- Total portfolio value
- Profit/Loss
- ROI
- Allocation percentage
- Dashboard summary

## ฟีเจอร์ที่ยังไม่มีตาราง

`Export Report` อยู่ใน requirements แต่ยังไม่มี model แยกใน schema ตอนนี้ให้สร้างเป็น service ที่ generate จากข้อมูลจริงก่อน ถ้าอนาคตต้องเก็บประวัติ report ค่อยเพิ่ม model
