# 08 UI Flow

# Flow หน้าจอผู้ใช้

## ภาพรวม

Frontend ยังไม่มีใน repo ปัจจุบัน เอกสารนี้เป็น flow เป้าหมายสำหรับ Next.js frontend ตาม requirements

## User Journey

```txt
Landing
-> Register
-> Login
-> Dashboard
-> Portfolio
-> Investment
-> Transaction
-> Goal
-> Notification
-> Profile
```

## Authentication Flow

```txt
Guest
-> Register หรือ Login
-> รับ access token
-> เก็บ auth state
-> ไป Dashboard
```

ถ้า token หมดอายุ:

```txt
API คืน 401
-> clear auth state
-> redirect ไป Login
```

## Register Page

Fields:

- First Name
- Last Name
- Email
- Password

ต้องมี validation และแสดง error เมื่อ email ซ้ำ

## Login Page

Fields:

- Email
- Password

เมื่อสำเร็จ:

```txt
Save token
-> Fetch profile
-> Dashboard
```

## Dashboard

ต้องแสดง:

- มูลค่าพอร์ตรวม
- เงินลงทุนทั้งหมด
- กำไร/ขาดทุน
- ROI
- จำนวนสินทรัพย์
- จำนวนพอร์ต
- Goal progress
- Recent transactions
- Recent announcements

กราฟที่ requirements ระบุ:

- Portfolio Growth: line chart
- Asset Allocation: pie chart
- Monthly Investment: bar chart

แนะนำใช้ Recharts ตาม requirements

## Portfolio Flow

```txt
Portfolio List
-> Create Portfolio
-> Portfolio Detail
-> Investment List
```

ผู้ใช้ทำได้เฉพาะ portfolio ของตัวเอง

## Category Flow

```txt
Category List
-> Create Category
-> Edit Category
-> Delete Category
```

Category ใช้ร่วมกับทุก portfolio ของ user

## Investment Flow

```txt
Investment List
-> Create Investment
-> Investment Detail
-> Update Investment
-> Transaction History
```

ต้องมี search/filter ตาม:

- asset name
- asset type
- category
- risk level
- date
- status
- profit/loss range

## Transaction Flow

```txt
Investment Detail
-> Create Transaction
-> Transaction History
```

ประเภท:

- BUY
- SELL
- DIVIDEND
- DEPOSIT
- WITHDRAW

## Goal Flow

```txt
Goal List
-> Create Goal
-> Goal Detail
-> Update Progress
```

แสดง progress และสถานะ `IN_PROGRESS`, `COMPLETED`, `FAILED`

## Notification Flow

```txt
Notification List
-> Notification Detail
-> Mark as Read
```

แจ้งเตือน goal, investment reminder และ system reminder

## Announcement Flow

User:

```txt
Dashboard
-> Announcement List
-> Announcement Detail
```

Admin:

```txt
Admin Dashboard
-> Announcement Management
```

## Report Export Flow

```txt
Report Page
-> เลือก portfolio/date range
-> เลือก format
-> Download report
```

Format ที่วางแผน:

- CSV
- PDF

## Admin Flow

```txt
Admin Login
-> Admin Dashboard
-> Users
-> Announcements
-> Activity Logs
```

## UX Requirements

ต้องรองรับ:

- Responsive Desktop/Mobile
- Dark Mode / Light Mode
- Loading Skeleton
- Toast Notification
- Empty State
- Error State
- Pagination
- Search / Filter
