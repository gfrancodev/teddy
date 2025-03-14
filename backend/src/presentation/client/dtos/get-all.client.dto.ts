import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllClientDTO {
  @ApiPropertyOptional({
    description: 'Página atual',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  current_page: number;

  @ApiPropertyOptional({
    description: 'Limite de itens por página',
    example: 16,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;

  @ApiPropertyOptional({
    description: 'Filtro de busca',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  filter?: string;

  user_id?: string;
}
