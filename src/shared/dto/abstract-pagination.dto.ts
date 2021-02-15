import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CategoryType } from '../../categories/dto/create-category.dto';

export class AbstractPaginationDto {
  @ApiProperty()
  @IsOptional()
  page: number = 1;

  @ApiProperty()
  @IsOptional()
  limit: number = 10;
}

export class CategoryFilterType {

  @IsNotEmpty()
  @IsIn([CategoryType.CONTACT, CategoryType.ORGANIZATION]) type: CategoryType;
}
