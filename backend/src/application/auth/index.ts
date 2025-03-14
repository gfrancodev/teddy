import { Global, Module } from '@nestjs/common';
import { LoginAuthUseCase } from './usecases/login.auth.usecase';
import { RegisterAuthUseCase } from './usecases/register.auth.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeAuthUseCase } from './usecases/me.auth.usecase';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
          issuer: configService.get<string>('JWT_ISSUER'),
          audience: configService.get<string>('JWT_AUDIENCE'),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [MeAuthUseCase, LoginAuthUseCase, RegisterAuthUseCase],
  exports: [MeAuthUseCase, LoginAuthUseCase, RegisterAuthUseCase],
})
export class AuthModule {}
