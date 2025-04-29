import { ListsService } from './lists.service';
import { ListGatewayInMemory } from './gateways/list-gateway-in-memory';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

const mockHttpService: Partial<HttpService> = {
  post: jest.fn().mockReturnValue(of(null)),
};

describe('ListsService', () => {
  let service: ListsService;
  let listGateway: ListGatewayInMemory;

  beforeEach(() => {
    listGateway = new ListGatewayInMemory();
    service = new ListsService(listGateway, mockHttpService as HttpService);
  });

  it('deve criar uma lista', async () => {
    const list = await service.create({ name: 'Lista de Teste' });
    expect(listGateway.items).toEqual([list]);
  });
});
