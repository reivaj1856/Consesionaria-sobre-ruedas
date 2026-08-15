import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('admin' | 'cliente' | 'administrador' | 'concesionaria' | 'agente')[]) => SetMetadata(ROLES_KEY, roles);
