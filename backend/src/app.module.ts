import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PipelineAuthGuard } from './infrastructure/guards/pipeline-auth.guard';
import { GlobalExceptionFilter } from './infrastructure/exception/exception.filter';
import { ApplicationModule } from './application';
import { PresentationModule } from './presentation/index';
import { InfraestructureModule } from './infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationModule,
    PresentationModule,
    InfraestructureModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PipelineAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
