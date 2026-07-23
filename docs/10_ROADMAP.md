# 10 Roadmap

# แผนพัฒนาโปรเจกต์

## สถานะปัจจุบัน

```txt
Auth, User, and Portfolio modules implemented
```

ความคืบหน้าโดยประมาณ:

```txt
30%
```

ทำแล้ว:

- เอกสารโปรเจกต์
- NestJS backend ใน `api/`
- Prisma schema
- initial migration
- DatabaseModule
- PrismaService
- ConfigModule
- Authentication with JWT and bcrypt
- User profile and password endpoints
- Portfolio CRUD with ownership validation

ยังไม่เสร็จ:

- Dashboard
- Notification
- Announcement
- Report Export
- Admin
- Frontend

## Phase 1: Auth และ Foundation

- [x] สร้าง NestJS project
- [x] ตั้ง Prisma schema
- [x] สร้าง DatabaseModule
- [x] ตั้ง ConfigModule
- [x] สร้าง Auth module stub
- [x] Register DTO
- [x] Login DTO
- [x] Hash password
- [x] Duplicate email check
- [x] JWT module
- [x] JWT guard
- [x] `POST /auth/register`
- [x] `POST /auth/login`

## Phase 2: User

- [x] User module
- [x] Get profile
- [x] Update profile
- [x] Change password
- [ ] Avatar URL
- [x] Safe user response

## Phase 3: Portfolio และ Category

- [x] Portfolio CRUD
- [x] Portfolio ownership
- [x] Default portfolio rule
- [x] Favorite portfolio
- [ ] Category CRUD
- [ ] Category ownership
- [ ] Restrict delete category in use

## Phase 4: Investment

- [ ] Investment CRUD
- [ ] Asset type
- [ ] Risk level
- [ ] Investment status
- [ ] Current price
- [ ] Category assignment
- [ ] Pagination
- [ ] Search / Filter
- [ ] Sorting

## Phase 5: Transaction

- [ ] BUY
- [ ] SELL
- [ ] DIVIDEND
- [ ] DEPOSIT
- [ ] WITHDRAW
- [ ] Transaction history
- [ ] Average cost policy

## Phase 6: Goal

- [ ] Goal CRUD
- [ ] Progress calculation
- [ ] Goal status
- [ ] Goal notification

## Phase 7: Dashboard

- [ ] Total portfolio value
- [ ] Total investment amount
- [ ] Profit/Loss
- [ ] ROI
- [ ] Asset allocation
- [ ] Portfolio growth chart data
- [ ] Monthly investment chart data
- [ ] Recent transactions

## Phase 8: Notification และ Announcement

- [ ] Notification list
- [ ] Mark as read
- [ ] Reminder notification
- [ ] Announcement list
- [ ] Announcement detail
- [ ] Admin announcement CRUD

## Phase 9: Report Export

- [ ] Portfolio report
- [ ] Transaction report
- [ ] Date range filter
- [ ] CSV export
- [ ] PDF export

## Phase 10: Admin

- [ ] User management
- [ ] Update user status
- [ ] Activity logs
- [ ] Admin dashboard

## Phase 11: Frontend

- [ ] Next.js app
- [ ] Auth pages
- [ ] Dashboard
- [ ] Portfolio pages
- [ ] Investment pages
- [ ] Transaction pages
- [ ] Goal pages
- [ ] Notification pages
- [ ] Report page
- [ ] Admin pages
- [ ] Responsive UI
- [ ] Dark/Light mode
- [ ] Loading/Error/Empty states

## เกณฑ์ผ่านตาม Personal Project

ต้องมี:

- [ ] Full-stack web app
- [ ] Authentication
- [ ] Protected routes
- [ ] อย่างน้อย 2 roles: User/Admin
- [ ] CRUD อย่างน้อย 2 entities
- [ ] Core features อย่างน้อย 2 ฟีเจอร์
- [ ] Database management
- [ ] Basic security

โปรเจกต์นี้ตั้งเป้าเกินขั้นต่ำ โดยทำระบบ portfolio/investment เต็มชุด
