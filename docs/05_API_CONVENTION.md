# 05 API Convention

# มาตรฐาน API

## ภาพรวม

API ใช้ REST บน NestJS และควรออกแบบให้สอดคล้องกับ requirements, README และ schema จริง

## Base URL

ปัจจุบัน backend run ที่:

```txt
http://localhost:3000
```

เป้าหมายของ versioned API:

```txt
/api/v1
```

หมายเหตุ: `main.ts` ปัจจุบันยังไม่ได้ตั้ง `app.setGlobalPrefix('api/v1')` ดังนั้น `/api/v1` ยังเป็น target convention ไม่ใช่ runtime จริง

## Resource Naming

ใช้ plural nouns:

```txt
/users
/portfolios
/categories
/investments
/transactions
/goals
/notifications
/announcements
/dashboard
/reports
```

หลีกเลี่ยง:

```txt
/createPortfolio
/getUsers
```

## HTTP Methods

- `GET`: อ่านข้อมูล
- `POST`: สร้างข้อมูล
- `PATCH`: แก้ไขบางส่วน
- `DELETE`: ลบข้อมูล

## Authentication Header

Private endpoint ต้องส่ง:

```txt
Authorization: Bearer <accessToken>
```

Public endpoint:

- `POST /auth/register`
- `POST /auth/login`
- `GET /announcements` ถ้า product ต้องการให้ guest อ่านได้

## Response Format เป้าหมาย

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

ควรทำ response helper หรือ interceptor ก่อนบังคับใช้ทุก endpoint

## Status Codes

- `200`: สำเร็จ
- `201`: สร้างสำเร็จ
- `204`: ลบสำเร็จและไม่มี body
- `400`: request ไม่ถูกต้อง
- `401`: ไม่ได้ login/token ไม่ถูกต้อง
- `403`: ไม่มีสิทธิ์
- `404`: ไม่พบข้อมูล
- `409`: ข้อมูลซ้ำหรือ conflict
- `422`: validation policy error ถ้าเลือกใช้
- `500`: server error

## Pagination

List endpoint ควรรองรับ:

```txt
page
limit
```

ตัวอย่าง:

```txt
GET /investments?page=1&limit=20
```

## Search, Filter, Sort

รองรับ query ตามความเหมาะสม:

```txt
search
sortBy
order
status
categoryId
portfolioId
assetType
riskLevel
dateFrom
dateTo
minProfit
maxProfit
type
```

`order`:

- `asc`
- `desc`

## UUID

ทุก route param ที่เป็น id ต้อง validate เป็น UUID

```txt
GET /portfolios/:id
GET /investments/:id
GET /goals/:id
```

## DTO

ตั้งชื่อไฟล์:

```txt
create-portfolio.dto.ts
update-portfolio.dto.ts
portfolio-response.dto.ts
```

ตั้งชื่อ class:

```txt
CreatePortfolioDto
UpdatePortfolioDto
PortfolioResponseDto
```

## Error Handling

ใช้ NestJS exceptions:

- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `ConflictException`
- `InternalServerErrorException`

ห้าม throw string

## Security Convention

Private endpoint ต้องตรวจ:

- JWT
- DTO
- UUID params
- role ถ้าเป็น admin endpoint
- ownership ถ้าเป็นข้อมูลของ user

## API Versioning

ใช้ `/api/v1` เมื่อเพิ่ม global prefix แล้ว ถ้ามี breaking change ในอนาคตให้ใช้ `/api/v2`
