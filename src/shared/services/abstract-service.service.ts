import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AbstractPaginationDto } from '../dto/abstract-pagination.dto';
import { PaginateItems } from '../response.transformer';

export class AbstractService {
  repository: any;
  name: string;

  create(payload: any) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  findAll(pagination: AbstractPaginationDto) {
    return PaginateItems(this.repository, pagination);
  }

  list() {
    return this.repository.find({ select: ['id', 'name'] });
  }

  async findOne(id: string) {
    const response = await this.repository.findOne(id);

    if (!response) {
      throw new NotFoundException(`${this.name} Not Found`);
    }

    return response;
  }

  async update(id: string, payload: any) {
    await this.findOne(id);
    await this.repository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repository.delete(id);
    return null;
  }
}
