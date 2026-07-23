# 13 Coding Standards

# มาตรฐานการเขียนโค้ด

## หลักทั่วไป

โค้ดต้อง:

- อ่านง่าย
- อธิบายได้
- แยกหน้าที่ชัด
- test ได้
- สอดคล้องกับไฟล์ที่มีอยู่

เลือกวิธีที่เข้าใจง่ายก่อนวิธีที่ซับซ้อน

## Backend

ใช้:

- TypeScript
- NestJS
- Prisma
- PostgreSQL
- pnpm

## Naming

ตัวแปรและ function ใช้ camelCase:

```ts
const currentUser = user;
function calculateProfit() {}
```

Class ใช้ PascalCase:

```ts
AuthService
PortfolioController
CreatePortfolioDto
```

Constant ใช้ UPPER_SNAKE_CASE:

```ts
const DEFAULT_PAGE_SIZE = 20;
```

Boolean ขึ้นต้นด้วย:

- `is`
- `has`
- `can`
- `should`

## File และ Folder

Folder:

```txt
portfolio
activity-log
```

File:

```txt
portfolio.controller.ts
portfolio.service.ts
portfolio.module.ts
create-portfolio.dto.ts
```

## Module Structure

```txt
feature/
|-- dto/
|-- feature.controller.ts
|-- feature.service.ts
|-- feature.module.ts
```

## Controller

Controller ทำ:

- route
- request
- DTO
- params/query
- call service

Controller ไม่ทำ:

- query database
- hash password
- business calculation
- ownership logic แบบกระจัดกระจาย

## Service

Service ทำ:

- business logic
- ownership validation
- Prisma query
- safe response
- throw exception

Service ไม่ควร return Express response object

## DTO

DTO ทำ:

- validate request shape
- validate enum/UUID/date/number

DTO ไม่ทำ:

- query database
- hash password
- generate token

## Prisma

ใช้ `PrismaService`

ใช้ `select` เพื่อคืน field ที่ปลอดภัย:

```ts
select: {
  id: true,
  email: true,
  firstname: true,
  lastname: true,
}
```

ห้ามคืน `password`

ห้ามแก้:

```txt
api/src/database/generated/
```

## Exception

ใช้ NestJS exception:

```ts
BadRequestException
UnauthorizedException
ForbiddenException
NotFoundException
ConflictException
InternalServerErrorException
```

ห้าม:

```ts
throw 'Error';
```

## Import

ใช้ alias `@/` ตาม project:

```ts
import { DatabaseModule } from '@/database/database.module';
```

ลำดับ import:

1. NestJS/Node
2. third-party
3. internal alias
4. relative

## API Response

รูปแบบเป้าหมาย:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

ควรมี helper/interceptor ก่อน enforce ทุก endpoint

## Security

ทุก feature ต้อง:

- validate DTO
- ใช้ JWT guard ถ้า private
- ใช้ role guard ถ้า admin
- ตรวจ ownership ถ้าเป็นข้อมูล user
- ไม่ return sensitive data
- ไม่ log token/password

## Testing

ขั้นต่ำ:

```bash
pnpm build
```

เมื่อมี behavior:

```bash
pnpm test
pnpm test:e2e
```

## Documentation

เมื่อเปลี่ยน code ต้องอัปเดต docs ที่เกี่ยวข้องทันที

ห้ามปล่อย docs บอกว่าเสร็จแล้ว ทั้งที่โค้ดยังเป็น planned
