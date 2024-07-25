import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class SystemMessage {
  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class FileBase64 {
  @ApiProperty()
  @IsString()
  base64: string;

  @ApiProperty()
  @IsString()
  extension: string;
}

export class SimplePrompt {
  @ApiProperty()
  @IsString()
  input: string;

  @ApiPropertyOptional({ type: FileBase64 })
  @ValidateNested()
  file: FileBase64;

  @ApiProperty({ type: [SystemMessage] })
  @IsArray()
  system: SystemMessage[];
}
