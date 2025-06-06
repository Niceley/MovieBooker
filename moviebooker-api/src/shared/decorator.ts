import { createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  });