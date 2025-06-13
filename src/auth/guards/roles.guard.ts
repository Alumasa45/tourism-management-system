import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JWTPayload } from "../strategies/at.strategy";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, UserRole } from "src/profiles/entities/profile.entity";
import { Repository } from "typeorm";
import { roles } from "../decorators/roles.decorator";



interface UserRequest extends Request {
    user?: JWTPayload;
}
const ROLES_KEY = 'roles';
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass,
        ]);

        if(!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<UserRequest>();
        const user = request.user;

        if(!user) {
            return false;
        }

        const userProfile = await this.profileRepository.findOne({
            where: { id: user.sub.toString()},
            select: ['id', 'role'],
        });

        if(!userProfile) {
            return false;
        }

        return requiredRoles.some((role) => userProfile?.role === role);
    }
}