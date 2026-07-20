import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('admin' | 'cliente')[]) => SetMetadata(ROLES_KEY, roles);
