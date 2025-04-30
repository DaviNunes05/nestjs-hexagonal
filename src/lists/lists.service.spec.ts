import { ListsService } from './lists.service';
import { ListGatewayInMemory } from './gateways/list-gateway-in-memory';

describe('ListsService', () => {
  let service: ListsService;
  let listPersistenceGateway: ListGatewayInMemory;
  let listIntegrationGateway: ListGatewayInMemory;

  beforeEach(() => {
    listPersistenceGateway = new ListGatewayInMemory();
    listIntegrationGateway = new ListGatewayInMemory();
    service = new ListsService(listPersistenceGateway, listIntegrationGateway);
  });

  it('deve criar uma lista', async () => {
    const list = await service.create({ name: 'Lista de Teste' });
    expect(listPersistenceGateway.items).toEqual([list]);
    expect(listIntegrationGateway.items).toEqual([list]);
  });
});
