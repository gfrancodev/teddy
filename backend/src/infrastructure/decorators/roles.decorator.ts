import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = Symbol('ROLES_KEY');
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
