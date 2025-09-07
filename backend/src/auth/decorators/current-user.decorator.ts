import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../common/types';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): AuthUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
