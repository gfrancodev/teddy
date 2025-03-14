import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClientDTO {
  user_id?: string;

  @ApiPropertyOptional({ description: 'Client name', example: 'Company XYZ' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Client salary', example: 5000.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salary?: number;

  @ApiPropertyOptional({
    description: 'Client company value',
    example: 1000000.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  company_value?: number;
}
