import { List } from '../entities/list.entity';
import { ListGatewayInterface } from './list-gateway-interface';

export class ListGatewayInMemory implements ListGatewayInterface {
  items: List[] = [];
  create(list: List): Promise<List> {
    list.id = this.items.length + 1;
    this.items.push(list);
    return Promise.resolve(list);
  }

  findAll(): Promise<List[]> {
    return Promise.resolve(this.items);
  }

  findById(id: number): Promise<List> {
    const list = this.items.find((item) => item.id === id);
    if (!list) {
      return Promise.reject(new Error(`List with id ${id} not found`));
    }
    return Promise.resolve(list);
  }
}
