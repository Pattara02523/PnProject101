import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AccessTokenPayload } from '@/auth/types/access-token-payload.type';

type RequestWithUser = {
  user?: AccessTokenPayload;
};

export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!data) {
      return request.user;
    }

    return request.user?.[data];
  }
);
