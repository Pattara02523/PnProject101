import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@/database/generated/prisma/enums';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { AccessTokenPayload } from '@/auth/types/access-token-payload.type';

type RequestWithUser = {
  user?: AccessTokenPayload;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. อ่าน Roles ที่กำหนดไว้บน Endpoint นั้นๆ จาก @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 2. ถ้า Endpoint นั้นไม่ได้แปะ @Roles() ไว้ = ไม่ต้องตรวจสิทธิ์ ให้ผ่านได้เลย
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. ดึงข้อมูลผู้ใช้จาก request.user (AccessTokenGuard ฉีดไว้ให้แล้ว)
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 4. ตรวจสอบว่า Role ของผู้ใช้ตรงกับที่ Endpoint กำหนดไว้ไหม
    const hasRole = requiredRoles.some((role) => user?.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Forbidden resource (คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้)');
    }

    return true;
  }
}
