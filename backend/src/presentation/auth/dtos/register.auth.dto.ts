import { toUsername } from '@/infrastructure/helpers/to-username.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class RegisterAuthDTO {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username', example: 'john_doe' })
  @Transform(({ value }) => toUsername(value))
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;
}
