import { Inject, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { ListGatewayInterface } from './gateways/list-gateway-interface';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @Inject('ListPersistenceGateway')
    private listPersistenceGateway: ListGatewayInterface, //porta listgatewaysequelize
    @Inject('ListIntegrationGateway')
    private listIntegrationGateway: ListGatewayInterface, //porta listgatewayhttp
  ) {}

  async create(createListDto: CreateListDto) {
    const list = new List(createListDto.name);
    await this.listPersistenceGateway.create(list);
    await this.listIntegrationGateway.create(list);
    return list;
  }

  findAll() {
    return this.listPersistenceGateway.findAll();
  }

  async findOne(id: number) {
    const list = await this.listPersistenceGateway.findById(id);
    if (!list) {
      throw new Error(`ListModel with id ${id} not found`);
    }
    return list;
  }
}
