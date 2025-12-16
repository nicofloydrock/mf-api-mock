import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SendPushDto {
  @ApiPropertyOptional({ example: 'Mock Push' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Hola desde el mock' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ example: 'agente' })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiPropertyOptional({ description: 'Delay en segundos', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  delaySeconds?: number;
}
