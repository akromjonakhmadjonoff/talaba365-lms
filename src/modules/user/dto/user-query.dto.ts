import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dtos/pagination-query.dto.js';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
    search?: string;
}
