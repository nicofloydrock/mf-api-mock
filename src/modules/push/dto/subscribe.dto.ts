import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

class PushKeysDto {
  @ApiProperty()
  @IsString()
  p256dh!: string;

  @ApiProperty()
  @IsString()
  auth!: string;
}

export class SubscribeDto {
  @ApiProperty({ example: 'https://updates.push.services.mozilla.com/wpush/v1/...' })
  @IsString()
  endpoint!: string;

  @ApiProperty({ type: PushKeysDto })
  @IsObject()
  keys!: PushKeysDto;
}
