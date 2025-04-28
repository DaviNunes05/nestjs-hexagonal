import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './entities/list.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List)
    private listModel: typeof List,
    private httpService: HttpService,
  ) {}

  async create(createListDto: CreateListDto) {
    const list = await this.listModel.create(createListDto);
    await lastValueFrom(
      this.httpService.post('lists', {
        name: list.name,
      }),
    );
    return list;
  }

  findAll() {
    return this.listModel.findAll();
  }

  async findOne(id: number) {
    const list = await this.listModel.findByPk(id);
    if (!list) {
      throw new Error(`List with id ${id} not found`);
    }
    return list;
  }
}
