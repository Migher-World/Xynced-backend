import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    // check if user role contains any of the roles in the guard
    const hasRole = () => roles.includes(user.role.slug);
    return user && user.role && hasRole();
  }
}
