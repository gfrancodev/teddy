import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = Symbol('IS_PUBLIC_KEY');
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
