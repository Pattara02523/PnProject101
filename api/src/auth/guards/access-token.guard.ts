import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvVariable } from '@/config/env.validation';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { AccessTokenPayload } from '@/auth/types/access-token-payload.type';

type RequestWithHeadersAndUser = {
  headers: {
    authorization?: string;
  };
  user?: AccessTokenPayload;
};

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<EnvVariable, true>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<RequestWithHeadersAndUser>();
    const token = this.extractToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('กรุณาส่ง access token');
    }

    try {
      request.user = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET', {
            infer: true
          })
        }
      );

      return true;
    } catch {
      throw new UnauthorizedException('access token ไม่ถูกต้องหรือหมดอายุ');
    }
  }

  private extractToken(authorization?: string): string | null {
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
