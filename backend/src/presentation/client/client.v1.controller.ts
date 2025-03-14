import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateClientDTO } from './dtos/create.client.dto';
import { UpdateClientDTO } from './dtos/update.client.dto';
import { GetAllClientDTO } from './dtos/get-all.client.dto';
import { CreateClientUseCase } from '@/application/client/usecases/create.client.usecase';
import { UpdateClientUseCase } from '@/application/client/usecases/update.client.usecase';
import { DeleteClientUseCase } from '@/application/client/usecases/delete.client.usecase';
import { GetAllClientUseCase } from '@/application/client/usecases/get-all.client.usecase';
import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator';
import { ClientMapper, Status } from '@/domain';
import { GetByIdClientUseCase } from '@/application/client/usecases/get-by-id.client.usecase';

@ApiBearerAuth()
@ApiTags('Clients')
@Controller('v1/client')
export class ClientV1Controller {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly getAllClientUseCase: GetAllClientUseCase,
    private readonly getByIdClientUseCase: GetByIdClientUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all clients' })
  @ApiQuery({ name: 'current_page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients retrieved successfully',
    example: ClientMapper.toPaginatedResponse({
      current_page: 1,
      total_pages: 3,
      total_items: 45,
      limit: 16,
      in_page: 16,
      has_next_page: true,
      has_previous_page: false,
      data: [
        {
          id: 1,
          name: 'Empresa XYZ',
          salary: 5000.0,
          company_value: 1000000.0,
          status: Status.ACTIVE,
          created_at: 1709913600000,
          user_id: 'uuid',
          updated_at: null,
          deleted_at: null,
        },
      ],
    }),
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getAll(
    @Query() query: GetAllClientDTO,
    @CurrentUser() currentUser: Auth.User,
  ) {
    return await this.getAllClientUseCase.execute(
      {
        ...query,
        user_id: currentUser.sub,
      },
      currentUser.role,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client created successfully',
    example: ClientMapper.toResponse({
      id: 1,
      name: 'Empresa XYZ',
      salary: 5000.0,
      company_value: 1000000.0,
      status: Status.ACTIVE,
      created_at: 1709913600000,
      user_id: 'uuid',
      updated_at: null,
      deleted_at: null,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Client name already exists',
  })
  async create(
    @Body() data: CreateClientDTO,
    @CurrentUser() currentUser: Auth.User,
  ) {
    return await this.createClientUseCase.execute({
      ...data,
      user_id: currentUser.sub,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client updated successfully',
    example: ClientMapper.toResponse({
      id: 1,
      name: 'Empresa XYZ Atualizada',
      salary: 6000.0,
      company_value: 1200000.0,
      status: Status.ACTIVE,
      created_at: 1709913600000,
      updated_at: 1709999999000,
      user_id: 'uuid',
      deleted_at: null,
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: number,
    @Body() data: UpdateClientDTO,
    @CurrentUser() currentUser: Auth.User,
  ) {
    return await this.updateClientUseCase.execute(id, {
      ...data,
      user_id: currentUser.sub,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client deleted successfully',
    example: null,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  async delete(@Param('id') id: number) {
    await this.deleteClientUseCase.execute(id);
    return null;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client retrieved successfully',
    example: ClientMapper.toResponse({
      id: 1,
      name: 'Empresa XYZ',
      salary: 5000.0,
      company_value: 1000000.0,
      status: Status.ACTIVE,
      created_at: 1709913600000,
      user_id: 'uuid',
      updated_at: null,
      deleted_at: null,
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
    schema: {
      example: {
        code: 3005,
        identifier: 'CLIENT_NOT_FOUND',
        client_message: 'Client not found',
        message: 'The requested client does not exist in the system',
      },
    },
  })
  async getById(@Param('id') id: number) {
    return await this.getByIdClientUseCase.execute(String(id));
  }
}
