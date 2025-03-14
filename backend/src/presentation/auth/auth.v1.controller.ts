import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDTO } from './dtos/login.auth.dto';
import { RegisterAuthDTO } from './dtos/register.auth.dto';
import { LoginAuthUseCase } from '@/application/auth/usecases/login.auth.usecase';
import { RegisterAuthUseCase } from '@/application/auth/usecases/register.auth.usecase';
import { IsPublic } from '@/infrastructure/decorators/is-public.decorator';
import { errorExemplo } from '@/infrastructure/helpers/error.exemplo.helper';
import { MeAuthUseCase } from '@/application/auth/usecases/me.auth.usecase';
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator';
import { Roles, Status, UserMapper } from '@/domain';

@ApiTags('Authentication')
@Controller('v1/auth')
export class AuthV1Controller {
  constructor(
    private readonly loginUseCase: LoginAuthUseCase,
    private readonly registerUseCase: RegisterAuthUseCase,
    private readonly meUseCase: MeAuthUseCase,
  ) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authenticated successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_in: 3600,
        user: {
          fullname: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    schema: {
      example: errorExemplo(
        HttpStatus.UNAUTHORIZED,
        6000,
        'Invalid credentials',
        'Unauthorized',
        '/v1/auth/login',
        {},
      ),
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not verified',
    schema: {
      example: errorExemplo(
        HttpStatus.FORBIDDEN,
        1004,
        'User not verified',
        'Forbidden',
        '/v1/auth/login',
        {},
      ),
    },
  })
  async login(@Body() data: LoginAuthDTO) {
    return await this.loginUseCase.execute(data);
  }

  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or username already exists',
    schema: {
      example: errorExemplo(
        HttpStatus.CONFLICT,
        1000,
        'Email is already in use',
        'Conflict',
        '/v1/auth/register',
        {},
      ),
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username already exists',
    schema: {
      example: errorExemplo(
        HttpStatus.CONFLICT,
        1001,
        'Username is already in use',
        'Conflict',
        '/v1/auth/register',
        {},
      ),
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Registration failed due to an internal error',
    schema: {
      example: errorExemplo(
        HttpStatus.INTERNAL_SERVER_ERROR,
        6001,
        'Registration failed',
        'Internal Server Error',
        '/v1/auth/register',
        {},
      ),
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to secure password',
    schema: {
      example: errorExemplo(
        HttpStatus.INTERNAL_SERVER_ERROR,
        6002,
        'Registration failed',
        'Internal Server Error',
        '/v1/auth/register',
        {},
      ),
    },
  })
  async register(@Body() data: RegisterAuthDTO) {
    await this.registerUseCase.execute(data);
    return {
      message: 'User registered successfully',
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    example: UserMapper.toResponse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      fullname: 'João Silva',
      email: 'joao.silva@example.com',
      username: 'joao_silva',
      last_access: 1696171200,
      status: Status.ACTIVE,
      role: Roles.USER,
      verified: true,
      created_at: 1693574400,
      updated_at: 1693574400,
      deleted_at: null,
    }),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: errorExemplo(
        HttpStatus.UNAUTHORIZED,
        6003,
        'Unauthorized',
        'Unauthorized',
        '/v1/auth/me',
        {},
      ),
    },
  })
  async me(@CurrentUser() currentUser: Auth.User) {
    return await this.meUseCase.execute(currentUser.sub);
  }
}
