import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../models';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
