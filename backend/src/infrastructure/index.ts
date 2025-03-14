import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepositoryEntity } from './repositories/entities/client.repository.entity';
import { UserRepositoryEntity } from './repositories/entities/user.repository.entity';
import {
  USER_REPOSITORY,
  USER_REPOSITORY_BASE,
  CLIENT_REPOSITORY,
  CLIENT_REPOSITORY_BASE,
} from './constants/repositories.constants';
import { createBaseRepository } from './repositories/base.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategyService } from './services/jwt.-stragegy.service';
import { UserRepository } from './repositories/user.repository';
import { ClientRepository } from './repositories/client.repository';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'db'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'user'),
        password: configService.get('POSTGRES_PASSWORD', 'password'),
        database: configService.get('POSTGRES_DB', 'teddy'),
        entities: [ClientRepositoryEntity, UserRepositoryEntity],
        synchronize: false,
        logging: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([UserRepositoryEntity, ClientRepositoryEntity]),
  ],
  providers: [
    JwtStrategyService,
    JwtService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_REPOSITORY_BASE,
      useClass: createBaseRepository(UserRepositoryEntity),
    },
    {
      provide: CLIENT_REPOSITORY,
      useClass: ClientRepository,
    },
    {
      provide: CLIENT_REPOSITORY_BASE,
      useClass: createBaseRepository(ClientRepositoryEntity),
    },
  ],
  exports: [
    USER_REPOSITORY,
    USER_REPOSITORY_BASE,
    CLIENT_REPOSITORY,
    CLIENT_REPOSITORY_BASE,
    TypeOrmModule,
    JwtService,
  ],
})
export class InfraestructureModule {}
