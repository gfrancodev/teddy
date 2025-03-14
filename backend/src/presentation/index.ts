import { Global, Module } from '@nestjs/common';
import { AuthV1Controller } from './auth/auth.v1.controller';
import { ClientV1Controller } from './client/client.v1.controller';

@Global()
@Module({
  controllers: [AuthV1Controller, ClientV1Controller],
})
export class PresentationModule {}
