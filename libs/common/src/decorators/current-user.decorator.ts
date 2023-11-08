import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "../models/user.schema";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UserDocument => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});