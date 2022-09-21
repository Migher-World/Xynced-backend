import { NotFoundException } from '@nestjs/common';
import { EntityTarget, getRepository } from 'typeorm';
import { AbstractPaginationDto } from '../dto/abstract-pagination.dto';
import { PaginateItems } from '../response.transformer';

export class AbstractService<T> {
  repository: any;
  modelName: string;
  fields: any[] = ['id', 'name'];

  constructor(repository, modelName: string, fields?: string[]) {
    this.repository = repository;
    this.modelName = modelName;
    this.fields = fields;
  }

  create(payload: any): Promise<T> {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  findAll<T>(pagination: AbstractPaginationDto) {
    return PaginateItems<T>(this.repository, pagination);
  }

  list(): Promise<T[]> {
    return this.repository.find({ select: this.fields });
  }

  async findOne(value: string, key = 'id'): Promise<T> {
    const where = {};
    where[key] = value;
    const response = await this.repository.findOne({ where });

    if (!response) {
      throw new NotFoundException(`${this.modelName} Not Found`);
    }

    return response;
  }

  async findOneBySlug(slug: string): Promise<T> {
    const response = await this.repository.findOne({ where: { slug } });

    if (!response) {
      throw new NotFoundException(`${this.modelName} Not Found`);
    }

    return response;
  }

  async update(id: string, payload: any): Promise<T> {
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
    const data = [];
    for (const value of payload) {
      const where = {};
      where[key] = value;
      const item = await getRepository(entity).findOne({ where: where });
      if (item) {
        data.push(item);
      }
    }
    return data;
  }
}
