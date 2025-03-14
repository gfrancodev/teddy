import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClientDTO {
  user_id: string;

  @ApiProperty({ description: 'Client name', example: 'Company XYZ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Client salary', example: 5000.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  salary: number;

  @ApiProperty({ description: 'Client company value', example: 1000000.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  company_value: number;
}
