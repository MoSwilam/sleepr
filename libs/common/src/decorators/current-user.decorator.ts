import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
