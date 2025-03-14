import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAuthDTO {
  @ApiProperty({ description: 'User identifier', example: 'usuario123' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'User password', example: 'senha123' })
  @IsString()
  password: string;
}
