import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AdminService } from '../admin.service';

@Injectable()
export class CurrentAdminInterceptor implements NestInterceptor {
  constructor(private adminService: AdminService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const account = request?.user?.adminAccount;

    if (account) {
      const admin = await this.adminService.getAdmin(account);
      request.currentAdmin = admin;
    }

    return next.handle();
  }
}
