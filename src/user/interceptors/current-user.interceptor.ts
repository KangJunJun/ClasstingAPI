import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const account = request?.user?.userAccount;

    if (account) {
      const user = await this.userService.getUser(account);
      request.currentUser = user;
    }

    return next.handle();
  }
}
