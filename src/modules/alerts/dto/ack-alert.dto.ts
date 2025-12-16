import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AckAlertDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  ack!: boolean;
}
