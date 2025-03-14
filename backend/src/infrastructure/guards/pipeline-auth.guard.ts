import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { Exception } from '../exception/builder/exception';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PipelineAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (this.isPublicRoute(context)) return true;

    try {
      const isAuthenticated = await super.canActivate(context);
      if (!isAuthenticated) throw new Exception('AUTH_TOKEN_INVALID');

      const request = this.getRequest(context);
      if (!request.user) throw new Exception('AUTH_TOKEN_INVALID');

      this.checkUserRole(context, request.user.role);
      return true;
    } catch (error) {
      if (error instanceof Exception) throw error;
      throw new Exception('AUTH_TOKEN_INVALID');
    }
  }

  public getRequest(context: ExecutionContext): Auth.Request<Request> {
    return context.switchToHttp().getRequest<Auth.Request<Request>>();
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private checkUserRole(context: ExecutionContext, userRole: string): void {
    const requiredRoles = this.getRequiredRoles(context);
    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(userRole)
    ) {
      throw new Exception('INTERNAL_FORBIDDEN_ERROR');
    }
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
    return (
      this.reflector?.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }
}
