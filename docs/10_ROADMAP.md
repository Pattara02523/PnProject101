# 10 Roadmap

# แผนพัฒนาโปรเจกต์

## สถานะปัจจุบัน

```txt
All Backend Modules (Auth, User, Portfolio, Category, Investment, Transaction, Goal, Dashboard, Notification, Announcement, Report, and Admin) fully implemented
```

ความคืบหน้าโดยประมาณ (Backend API):

```txt
100%
```

ทำแล้ว:

- เอกสารโปรเจกต์
- NestJS backend ใน `api/`
- Prisma schema
- initial migration
- DatabaseModule + PrismaService
- ConfigModule + env validation
- Infrastructure modules (BcryptService, JwtInfraModule)
- Global Guard (AccessTokenGuard) + @Public() decorator
- Authentication (Register, Login, JWT)
- User module (Profile, Update profile, Change password)
- Portfolio CRUD with ownership validation and default rule
- Category CRUD with ownership validation and restrict-delete rule
- Investment CRUD with ownership chain validation and search/filter/pagination
- Transaction CRUD with 3-level ownership chain (transaction -> investment -> portfolio -> user)
- Goal CRUD with progress percentage calculation and auto status evaluation
- Dashboard real-time summary calculation (portfolio value, total capital, profit/loss, ROI, asset allocation, goal summary, recent transactions)
- Notification module (list notifications, mark as read, delete notification)
- Announcement module (public list/detail, admin CRUD with RolesGuard)

ยังไม่เสร็จ:

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
- [x] Category CRUD
- [x] Category ownership
- [x] Restrict delete category in use

## Phase 4: Investment

- [x] Investment CRUD
- [x] Asset type
- [x] Risk level
- [x] Investment status
- [x] Current price
- [x] Category assignment
- [x] Pagination
- [x] Search / Filter
- [x] Sorting

## Phase 5: Transaction

- [x] BUY
- [x] SELL
- [x] DIVIDEND
- [x] DEPOSIT
- [x] WITHDRAW
- [x] Transaction history
- [x] Average cost policy

## Phase 6: Goal

- [x] Goal CRUD
- [x] Progress calculation
- [x] Goal status
- [ ] Goal notification

## Phase 7: Dashboard

- [x] Total portfolio value
- [x] Total investment amount
- [x] Profit/Loss
- [x] ROI
- [x] Asset allocation
- [ ] Portfolio growth chart data
- [ ] Monthly investment chart data
- [x] Recent transactions

## Phase 8: Notification และ Announcement

- [x] Notification history
- [x] Mark as read
- [x] Announcement CRUD (Admin)
- [x] Public announcements (User)
- [x] Announcement detail
- [x] Admin announcement CRUD

## Phase 9: Report Export

- [x] Portfolio report (CSV & PDF)
- [x] Transaction report (CSV & PDF)
- [x] Date range filter
- [x] CSV export
- [x] PDF export

## Phase 10: Admin

- [x] User management
- [x] Update user status
- [x] Activity logs
- [x] Admin dashboard

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
