import { NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AppDataSource } from '../../config/db.config';
import { CacheService } from '../../modules/cache/cache.service';
import { AbstractPaginationDto } from '../dto/abstract-pagination.dto';

export class AbstractService<T> {
  constructor(
    protected repository: Repository<T>,
    protected modelName: string,
    protected selectFields?: FindOptionsSelect<T>,
    protected cache?: CacheService,
  ) {}

  create(payload: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  findAll<T>(
    pagination: AbstractPaginationDto,
    searchOptions: FindOptionsWhere<T> | FindManyOptions<T> = {},
  ) {
    return this.paginateItems<T>(this.repository, pagination, searchOptions);
  }

  list(
    searchOptions: FindOptionsWhere<T> | FindManyOptions<T> = {},
  ): Promise<T[]> {
    return this.repository.find({
      select: this.selectFields,
      ...searchOptions,
    });
  }

  async findOne(value: string, key = 'id'): Promise<T> {
    const where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {};
    where[key] = value;
    const response = await this.repository.findOne({ where });

    if (!response) {
      throw new NotFoundException(`${this.modelName} Not Found`);
    }

    return response;
  }

  async findOneBySlug(slug: string): Promise<T> {
    const where = { slug };
    const response = await this.repository.findOne({ where: where as any });

    if (!response) {
      throw new NotFoundException(`${this.modelName} Not Found`);
    }

    return response;
  }

  async update(id: string, payload: QueryDeepPartialEntity<T>): Promise<T> {
    await this.findOne(id);
    await this.repository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: string, ...args: any): Promise<any> {
    await this.findOne(id);
    await this.repository.delete(id);
    return {};
  }

  async resolveRelationships<T>(
    payload: string[],
    entity: EntityTarget<T>,
    key = 'id',
  ): Promise<T[]> {
    const data: T[] = [];
    for (const value of payload) {
      const where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {};
      where[key] = value;
      const item = await AppDataSource.getRepository(entity).findOne({
        where: where,
      });
      if (item) {
        data.push(item);
      }
    }
    return data;
  }

  async paginateItems<T>(
    repository: any,
    options: IPaginationOptions,
    searchOptions: FindOptionsWhere<T> | FindManyOptions<T> = {},
  ) {
    const response = await paginate(repository, options, searchOptions);

    const pagination = {
      page: Number(response.meta.currentPage),
      pageCount: Number(response.meta.totalPages),
      perPage: Number(response.meta.itemsPerPage),
      total: Number(response.meta.totalItems),
      skipped: Number(
        response.meta.itemsPerPage * (response.meta.currentPage - 1),
      ),
    };

    return {
      list: response.items,
      pagination,
    };
  }
}
