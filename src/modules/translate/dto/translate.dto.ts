import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TranslateDto {
  @ApiProperty({ example: 'hola' })
  @IsString()
  text!: string;

  @ApiPropertyOptional({ example: 'es' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  target?: string;
}
