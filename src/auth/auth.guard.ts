// https://docs.nestjs.com/guards
// request를 다음단계로 넘어갈지 말지를 결정함.

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";



@Injectable()
// CanActive is function, true를 리턴하면 request 진행, false 를 리턴하면 request를 멈추게 함
export class AuthGuard implements CanActivate { 
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if(!user) {
      return false;
    }

    return true;
  }
}