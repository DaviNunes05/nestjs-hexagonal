import { Inject, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ListGatewayInterface } from './gateways/list-gateway-interface';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @Inject('ListGatewayInterface')
    private listGateway: ListGatewayInterface, //porta listgatewaysequelize
    private httpService: HttpService,
  ) {}

  async create(createListDto: CreateListDto) {
    const list = new List(createListDto.name);
    await this.listGateway.create(list);
    await lastValueFrom(
      this.httpService.post('lists', {
        name: list.name,
      }),
    );
    return list;
  }

  findAll() {
    return this.listGateway.findAll();
  }

  async findOne(id: number) {
    const list = await this.listGateway.findById(id);
    if (!list) {
      throw new Error(`ListModel with id ${id} not found`);
    }
    return list;
  }
}
