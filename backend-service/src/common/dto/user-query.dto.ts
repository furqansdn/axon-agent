import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserQuery {
  @IsString()
  @ApiProperty()
  query: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  queryNumber: number;
}
