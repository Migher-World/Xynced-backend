import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AbstractPaginationDto } from '../dto/abstract-pagination.dto';
import {
  sendListReponse,
  sendObjectResponse,
  sendPaginatedListReponse,
} from '../response.transformer';

export abstract class AbstractController {
  service: any;
  name: string;

  async create(@Body() payload: any) {
    const response = await this.service.create(payload);
    return sendObjectResponse(response, `${this.name} Created`);
  }

  // @ApiResponse({ status: 200, type: AbstractResponse })
  @Get()
  async findAll(@Query() pagination: AbstractPaginationDto) {
    const response = await this.service.findAll(pagination);
    return sendPaginatedListReponse(response, 'Success');
  }

  // @ApiResponse({ status: 200, type: AbstractResponse })
  @Get('/list/get')
  async list() {
    const response = await this.service.list();
    return sendListReponse(response, 'Success');
  }

  // @ApiResponse({ status: 200, type: AbstractResponse })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.service.findOne(id);
    return sendObjectResponse(response, 'Success');
  }

  // @ApiResponse({ status: 200, type: AbstractResponse })
  async update(@Param('id') id: string, @Body() payload: any) {
    const response = await this.service.update(id, payload);
    return sendObjectResponse(response, `${this.name} Updated`);
  }

  // @ApiResponse({ status: 200, type: AbstractResponse })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.service.remove(id);
    return sendObjectResponse(response, `${this.name} Deleted`);
  }
}
