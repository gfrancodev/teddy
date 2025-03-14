import { Global, Module } from '@nestjs/common';
import { CreateClientUseCase } from './usecases/create.client.usecase';
import { DeleteClientUseCase } from './usecases/delete.client.usecase';
import { GetAllClientUseCase } from './usecases/get-all.client.usecase';
import { GetByIdClientUseCase } from './usecases/get-by-id.client.usecase';
import { UpdateClientUseCase } from './usecases/update.client.usecase';

@Global()
@Module({
  providers: [
    CreateClientUseCase,
    DeleteClientUseCase,
    GetAllClientUseCase,
    GetByIdClientUseCase,
    UpdateClientUseCase,
  ],
  exports: [
    CreateClientUseCase,
    DeleteClientUseCase,
    GetAllClientUseCase,
    GetByIdClientUseCase,
    UpdateClientUseCase,
  ],
})
export class ClientModule {}
