import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/database/generated/prisma/enums';

export const ROLES_KEY = 'roles';

// Decorator ที่แปะบน Endpoint เพื่อระบุว่าสิทธิ์ไหนเข้าได้บ้าง
// ตัวอย่างใช้งาน: @Roles(UserRole.ADMIN)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
