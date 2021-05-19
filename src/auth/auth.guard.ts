import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<AllowedRoles>(
        'roles',
        context.getHandler(),
      );
      if (!roles) return true;

      const gqlContext = GqlExecutionContext.create(context).getContext();
      const token = gqlContext.token;
      if (!token) return false;

      const decoded = this.jwtService.verify(token.toString());
      if (!(typeof decoded === 'object' && decoded.hasOwnProperty('id')))
        return false;
      const userId = decoded['id'];

      const { user } = await this.userService.findById({ userId });
      if (!user) return false;
      gqlContext['user'] = user;

      return roles.includes('Any') || roles.includes(user.role);
    } catch (error) {
      return false;
    }
  }
}
