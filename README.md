# API de Listas com Arquitetura Hexagonal em NestJS

## O que é a aplicação?

Esta aplicação é uma API REST para gerenciamento de listas, construída com NestJS e seguindo os princípios da Arquitetura Hexagonal (também conhecida como Ports and Adapters). A API permite criar, listar e buscar itens, persistindo dados localmente em SQLite e também integrando com um sistema externo via HTTP.

## Funcionalidades principais

A API oferece os seguintes endpoints:
- `GET /lists` - Retorna todas as listas
- `GET /lists/:id` - Retorna uma lista específica pelo ID
- `POST /lists` - Cria uma nova lista

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/nest-hexagonal.git
cd nest-hexagonal

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run start:dev

# Para iniciar o servidor fake API para integração
npm run fake-api
```

## Scripts disponíveis

```bash
# Desenvolvimento
npm run start:dev     # Inicia o servidor em modo watch

# Produção
npm run build         # Compila o projeto
npm run start:prod    # Inicia em modo produção

# Testes
npm run test          # Executa testes unitários
npm run test:e2e      # Executa testes end-to-end

# Ferramentas
npm run format        # Formata o código com Prettier
npm run lint          # Executa o ESLint
npm run fake-api      # Inicia JSON Server na porta 3001
```

## Arquitetura Hexagonal: O Conceito

A Arquitetura Hexagonal, proposta por Alistair Cockburn, busca criar aplicações onde a lógica de negócio é o centro do sistema, isolada de detalhes técnicos externos.

Imagine a aplicação como um hexágono:
- No **centro** está o domínio com a lógica de negócio
- Nas **bordas** estão as portas (interfaces) que definem como o centro se comunica com o mundo exterior
- Do lado de **fora** estão os adaptadores que implementam essas portas

Esta estrutura traz três principais benefícios:
1. **Testabilidade** - Podemos testar a lógica de negócio facilmente com adaptadores mock
2. **Flexibilidade** - Podemos trocar implementações (banco de dados, serviços externos) sem afetar o núcleo
3. **Clareza** - Separa claramente o que é regra de negócio do que é infraestrutura

## Fluxo de Execução da Aplicação

Quando uma requisição chega para criar uma lista:

1. **Controller Layer** (`ListsController`): 
   - Recebe a requisição HTTP com os dados da lista
   - Converte o DTO para o formato esperado pelo serviço

2. **Service Layer** (`ListsService`): 
   - Contém a lógica de negócio
   - Cria uma entidade `List` com os dados recebidos
   - Utiliza as portas injetadas para persistir os dados

3. **Ports** (`ListGatewayInterface`): 
   - Interfaces que definem contratos para operações externas
   - Declaram métodos como `create`, `findAll` e `findById`

4. **Adapters**: 
   - Implementam as portas para conectar com sistemas externos
   - `ListGatewaySequelize`: persiste dados no SQLite
   - `ListGatewayHttp`: envia dados para uma API externa

## Demonstração de Portas e Adaptadores no Código

Em nosso projeto:

- A **porta** `ListGatewayInterface` define o contrato:
  ```typescript
  export interface ListGatewayInterface {
    create(list: List): Promise<List>;
    findAll(): Promise<List[]>;
    findById(id: number): Promise<List>;
  }
  ```

- Temos **três adaptadores** que implementam essa interface:
  1. `ListGatewaySequelize` - Para persistência em SQLite
  2. `ListGatewayHttp` - Para integração com API externa
  3. `ListGatewayInMemory` - Para testes unitários

- O `ListsService` usa essas portas sem conhecer suas implementações:
  ```typescript
  constructor(
    @Inject('ListPersistenceGateway')
    private listPersistenceGateway: ListGatewayInterface,
    @Inject('ListIntegrationGateway')
    private listIntegrationGateway: ListGatewayInterface
  ) {}
  ```

## Benefícios na Prática

Esta arquitetura nos permite:
1. **Alternar bancos de dados** sem modificar a lógica de negócio
2. **Trocar APIs externas** simplesmente criando novos adaptadores
3. **Testar facilmente** usando o adaptador em memória, como visto nos testes

## Estrutura de Diretórios

```
src/
├── lists/                  # Módulo de listas
│   ├── dto/                # Data Transfer Objects
│   ├── entities/           # Entidades de domínio
│   ├── gateways/           # Adaptadores e portas
│   │   ├── list-gateway-interface.ts     # Porta (interface)
│   │   ├── list-gateway-http.ts          # Adaptador HTTP
│   │   ├── list-gateway-in-memory.ts     # Adaptador para testes
│   │   └── list-gateway.sequelize.ts     # Adaptador Sequelize
│   ├── lists.controller.ts  # Controller REST
│   ├── lists.module.ts      # Módulo NestJS
│   └── lists.service.ts     # Serviço (lógica de negócio)
├── app.module.ts           # Módulo principal da aplicação
└── main.ts                 # Ponto de entrada
```

## Conclusão

Esta aplicação demonstra como implementar uma arquitetura hexagonal com NestJS, trazendo maior flexibilidade, testabilidade e organização ao código. O padrão de portas e adaptadores nos permite isolar a lógica de negócio das preocupações externas, resultando em um sistema mais robusto e manutenível.