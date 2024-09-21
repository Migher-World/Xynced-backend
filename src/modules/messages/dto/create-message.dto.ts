import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  conversationId: string;

  @IsOptional()
  body: string;

  @IsOptional()
  @ApiHideProperty()
  metadata: Record<string, unknown>;
}
