import { Injectable, type CanActivate, type ExecutionContext, Inject } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserRole } from "../../user/enums/user-role.enum"
import { ROLES_KEY } from "../decorators/roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    
    return requiredRoles.some((role) => user.role === role)
  }
}

