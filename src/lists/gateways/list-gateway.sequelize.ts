import { InjectModel } from '@nestjs/sequelize';
import { ListModel } from '../entities/list.model';
import { ListGatewayInterface } from './list-gateway-interface';
import { List } from '../entities/list.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListGatewaySequelize implements ListGatewayInterface {
  constructor(
    @InjectModel(ListModel)
    private listModel: typeof ListModel,
  ) {}

  async create(list: List): Promise<List> {
    const newListModel = await this.listModel.create(list);
    list.id = newListModel.id;
    return list;
  }

  async findAll(): Promise<List[]> {
    const listsModels = await this.listModel.findAll();
    return listsModels.map(
      (listModel) => new List(listModel.name, listModel.id),
    );
  }

  async findById(id: number): Promise<List> {
    const listModel = await this.listModel.findByPk<ListModel>(id);

    if (!listModel) {
      throw new Error(`ListModel with id ${id} not found`);
    }

    return new List(listModel.name, listModel.id);
  }
}
