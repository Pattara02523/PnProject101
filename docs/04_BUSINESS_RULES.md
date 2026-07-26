# 04 Business Rules

# กฎทางธุรกิจ

## ภาพรวม

กฎนี้อ้างอิงจาก README, requirements และ Prisma schema ปัจจุบัน ใช้เป็นแนวทางก่อนเขียน controller/service ทุกฟีเจอร์

## User และ Authentication

Register:

- email ต้องไม่ซ้ำ
- password ต้อง hash ก่อนบันทึก
- user ใหม่มี role เป็น `USER`
- user ใหม่มี status เป็น `ACTIVE`
- ควรบันทึก activity log เป็น `REGISTER`

Login:

- login ด้วย email/password
- ตรวจ password ด้วย bcrypt
- user ที่ `SUSPENDED` หรือ `DELETED` ห้าม login
- login สำเร็จคืน access token
- login ไม่สำเร็จคืน `401 Unauthorized`

Profile:

- user แก้ข้อมูลตัวเองได้
- user เปลี่ยน role ตัวเองไม่ได้
- user แก้ข้อมูลคนอื่นไม่ได้

## Role

`USER` ทำได้:

- จัดการ portfolio ของตัวเอง
- จัดการ category ของตัวเอง
- จัดการ investment ของตัวเอง
- จัดการ transaction ของตัวเอง
- จัดการ goal ของตัวเอง
- อ่าน announcement ที่ published
- จัดการ notification ของตัวเอง
- export report ของตัวเอง

`ADMIN` ทำได้:

- จัดการ announcement
- ดู users
- จัดการ user status
- ดู activity logs
- ดูภาพรวมระบบ

## Portfolio

- Portfolio ต้องเป็นของ user คนเดียว
- User มีหลาย portfolio ได้
- User เห็นเฉพาะ portfolio ของตัวเอง
- `isDefault` ควรมีได้ไม่เกิน 1 portfolio ต่อ user
- `isFavorite` เป็น preference ของ user

## Category

- Category เป็นของ user
- Category ใช้ร่วมกับหลาย investment ได้
- User ใช้ category ของคนอื่นไม่ได้
- ลบ category ไม่ได้ถ้ายังถูกใช้โดย investment

## Investment

- Investment ต้องมี portfolio
- Investment ต้องมี category
- portfolio และ category ต้องเป็นของ user เดียวกัน
- quantity ห้ามติดลบ
- price ห้ามติดลบ
- riskLevel ต้องเป็น `LOW`, `MEDIUM`, `HIGH`
- status ต้องเป็น `ACTIVE` หรือ `SOLD`
- profit/loss และ ROI ต้องคำนวณ ไม่เก็บซ้ำ

## Transaction

- Transaction เป็นของ investment
- ต้องตรวจ ownership ผ่าน investment -> portfolio -> user
- amount ต้องมากกว่า 0
- `BUY` และ `SELL` ควรมี quantity และ price
- `DIVIDEND`, `DEPOSIT`, `WITHDRAW` อาจใช้ amount เป็นหลัก
- `BUY` และ `SELL` ต้องมี quantity และ price มากกว่า 0
- ห้ามบันทึกหรือแก้ `SELL` จนทำให้จำนวนคงเหลือติดลบ
- ทุกการสร้าง แก้ไข และลบ transaction ต้องคำนวณ quantity, average cost และ status ของ investment ใหม่ใน database transaction เดียวกัน
- การคำนวณใช้ลำดับ `transactionDate` แล้วตามด้วย `createdAt`; `BUY` ปรับต้นทุนเฉลี่ยแบบถ่วงน้ำหนัก ส่วน `SELL` ไม่เปลี่ยนต้นทุนเฉลี่ย

## Goal

- Goal เป็นของ user
- targetAmount ต้องมากกว่า 0
- currentAmount ห้ามติดลบ
- progress ใช้คำนวณจาก currentAmount / targetAmount
- status ได้แก่ `IN_PROGRESS`, `COMPLETED`, `FAILED`

## Dashboard

Dashboard ต้องแสดง:

- มูลค่าพอร์ตการลงทุนรวม
- เงินลงทุนทั้งหมด
- กำไร/ขาดทุนรวม
- ROI
- จำนวนสินทรัพย์
- จำนวน portfolio
- goal progress
- recent transactions
- chart data เช่น portfolio growth, asset allocation, monthly investment

Dashboard ห้ามเก็บค่าคำนวณซ้ำใน database

## Search และ Filter

ระบบควรรองรับการค้นหา/กรองตาม:

- asset name
- asset type
- category
- risk level
- investment date
- investment status
- profit/loss range

และเรียงลำดับตาม:

- date
- amount
- ROI
- profit
- asset name

## Notification

แจ้งเตือนเมื่อ:

- goal ใกล้สำเร็จ
- investment ไม่มีการ update ราคานาน
- มี reminder ที่ระบบสร้าง
- มีเหตุการณ์สำคัญของระบบ

Notification เป็นข้อมูลส่วนตัวของ user

## Announcement

- Announcement เป็นประกาศสาธารณะ
- Admin เท่านั้นที่สร้าง/แก้ไข/ลบ/publish
- User อ่านได้เฉพาะ published announcement
- Announcement ไม่มี read status รายคน

## Export Report

- User export report ได้เฉพาะข้อมูลของตัวเอง
- Report ต้องคำนวณจากข้อมูลจริง
- ต้องไม่เปิดเผยข้อมูลของ user อื่น
- CSV portfolio และ transaction report รองรับ `portfolioId?`, `dateFrom?`, `dateTo?`
- เมื่อระบุ `portfolioId` ต้องเป็นพอร์ตของผู้ใช้ปัจจุบัน มิฉะนั้นตอบ `404`
- ช่วงวันรวมวันเริ่มต้นและวันสิ้นสุดทั้งหมดตามเวลา UTC
- CSV มี UTF-8 BOM เพื่อเปิดด้วย Excel ได้ถูกต้อง
- PDF export ยังเป็นงานลำดับถัดไป

## Ownership

ทุก request ที่เกี่ยวกับข้อมูล user ต้องตรวจ ownership

ตัวอย่าง:

```txt
authenticatedUser.id
-> Portfolio.userId
-> Investment.portfolioId
-> Transaction.investmentId
```

ถ้าไม่ใช่เจ้าของ ให้คืน `403 Forbidden` หรือ `404 Not Found` ตาม policy ของ endpoint
