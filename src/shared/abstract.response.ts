import { ApiResponseProperty } from '@nestjs/swagger';

export class AbstractResponse {
  @ApiResponseProperty()
  status: boolean;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  data: any;
}
