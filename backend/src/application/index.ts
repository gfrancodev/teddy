import { Global, Module } from '@nestjs/common';
import { ClientModule } from './client';
import { AuthModule } from './auth';

@Global()
@Module({
  imports: [AuthModule, ClientModule],
})
export class ApplicationModule {}
