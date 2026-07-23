# 07 Folder Structure

# โครงสร้างโฟลเดอร์

## ภาพรวม

โปรเจกต์ปัจจุบันมีเอกสารที่ root และ backend NestJS อยู่ใน `api/`

```txt
PNProject/
|-- api/
|-- docs/
|-- readme.md
```

Backend ใช้โครงแบบ NestJS API เหมือน repo ตัวอย่าง `earth824/dnc02-fakebuck-api`

## โครงสร้าง Backend ปัจจุบัน

```txt
api/
|-- prisma/
|   |-- schema.prisma
|   |-- migrations/
|-- src/
|   |-- app.module.ts
|   |-- main.ts
|   |-- auth/
|   |-- config/
|   |-- database/
|-- test/
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
|-- nest-cli.json
|-- tsconfig.json
|-- tsconfig.build.json
|-- eslint.config.mjs
|-- prisma.config.ts
```

## โครงสร้าง `src` ปัจจุบัน

```txt
api/src/
|-- main.ts
|-- app.module.ts
|-- auth/
|   |-- auth.module.ts
|   |-- auth.controller.ts
|   |-- auth.service.ts
|   |-- dto/
|       |-- register.dto.ts
|-- config/
|   |-- env.validation.ts
|-- database/
|   |-- database.module.ts
|   |-- prisma.service.ts
|   |-- generated/
```

## โครงสร้างที่วางแผน

```txt
api/src/
|-- common/
|-- auth/
|-- user/
|-- portfolio/
|-- category/
|-- investment/
|-- transaction/
|-- goal/
|-- announcement/
|-- notification/
|-- activity-log/
|-- dashboard/
|-- report/
|-- admin/
```

สร้าง folder เมื่อเริ่มทำ feature จริงเท่านั้น

## มาตรฐาน Feature Module

```txt
feature/
|-- dto/
|   |-- create-feature.dto.ts
|   |-- update-feature.dto.ts
|   |-- feature-response.dto.ts
|-- feature.controller.ts
|-- feature.service.ts
|-- feature.module.ts
```

ตัวอย่าง:

```txt
portfolio/
|-- dto/
|   |-- create-portfolio.dto.ts
|   |-- update-portfolio.dto.ts
|   |-- portfolio-response.dto.ts
|-- portfolio.controller.ts
|-- portfolio.service.ts
|-- portfolio.module.ts
```

## Database Folder

```txt
api/src/database/
|-- database.module.ts
|-- prisma.service.ts
|-- generated/
```

Prisma schema:

```txt
api/prisma/schema.prisma
```

ห้ามแก้ไฟล์ใน `generated/` ด้วยมือ

## Common Folder ที่วางแผน

```txt
common/
|-- decorators/
|-- filters/
|-- guards/
|-- interceptors/
|-- pipes/
|-- responses/
|-- types/
|-- utils/
```

ใช้เก็บของที่ reuse ได้หลาย module เช่น guard, response helper, pagination helper

## Import Rule

ใช้ alias `@/` ตามโค้ดปัจจุบัน

```ts
import { DatabaseModule } from '@/database/database.module';
```

## Frontend ที่วางแผน

ถ้าสร้าง frontend ให้แยกเป็น:

```txt
web/
|-- app/
|-- components/
|-- features/
|-- lib/
|-- hooks/
|-- types/
```

ห้ามเอา frontend ไปปนใน `api/src`
