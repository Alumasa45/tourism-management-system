import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/profiles/entities/profile.entity";

export const ROLES_KEY = 'roles';
export const roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)