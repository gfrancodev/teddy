# Teddy Backend

API RESTful construída com NestJS seguindo os princípios da Onion Architecture (Arquitetura Cebola) e boas práticas de desenvolvimento.

## 🌟 Diferenciais Técnicos

| Tecnologia/Conceito | Descrição | Benefício |
|---------------------|-----------|-----------|
| Onion Architecture | Arquitetura em camadas com dependências apontando para o centro | • Maior isolamento entre camadas<br>• Facilita testes unitários<br>• Baixo acoplamento<br>• Domínio independente de frameworks |
| Argon2 vs Bcrypt | Algoritmo de hash vencedor da competição PHC | • Maior resistência a ataques de hardware<br>• Uso de memória configurável<br>• Paralelismo ajustável<br>• Mais seguro contra ataques de GPU |
| UUIDv7 | Versão mais recente do UUID com ordenação temporal | • IDs ordenáveis temporalmente<br>• Maior entropia que UUIDv4<br>• Compatível com sistemas distribuídos<br>• Reduz fragmentação no banco |
| Vitest | Framework de testes moderno | • Execução paralela<br>• Compatibilidade com TypeScript<br>• Melhor performance que Jest<br>• API similar ao Jest |

## 🏗️ Arquitetura

O projeto utiliza a Onion Architecture, que é uma forma de arquitetura em camadas que enfatiza a separação de preocupações e a independência de frameworks. A estrutura está organizada nas seguintes camadas:

### 📦 Estrutura de Pastas

```
src/
├── domain/           # Regras de negócio e interfaces core
├── application/      # Casos de uso da aplicação
├── infrastructure/   # Implementações técnicas e adaptadores
└── presentation/     # Controllers e DTOs
```

#### Domain (Núcleo)
- Contém as entidades de negócio (User, Client)
- Interfaces dos repositórios
- Enums e tipos do domínio
- Factories e Mappers

#### Application
- Casos de uso (UseCases)
- Lógica de negócio
- Testes unitários dos casos de uso

#### Infrastructure
- Implementações dos repositórios
- Serviços externos
- Helpers e utilitários
- Guards e decorators
- Tratamento de exceções

#### Presentation
- Controllers
- DTOs (Data Transfer Objects)
- Validações de entrada

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### Users
| Coluna      | Tipo         | Descrição                    |
|-------------|--------------|------------------------------|
| id          | UUID         | ID único (UUIDv7)           |
| fullname    | VARCHAR(50)  | Nome completo               |
| email       | VARCHAR(255) | Email único                 |
| username    | VARCHAR(255) | Nome de usuário único       |
| last_access | BIGINT       | Último acesso (timestamp)   |
| password    | VARCHAR(255) | Senha criptografada         |
| status      | ENUM         | active/inactive/blocked/deleted |
| role        | ENUM         | user/admin                  |
| verified    | BOOLEAN      | Status de verificação       |
| created_at  | BIGINT       | Data de criação (timestamp) |
| updated_at  | BIGINT       | Data de atualização         |
| deleted_at  | BIGINT       | Data de exclusão            |

#### Clients
| Coluna        | Tipo         | Descrição                    |
|---------------|--------------|------------------------------|
| id            | SERIAL       | ID único auto-incremento     |
| user_id       | UUID         | Referência ao usuário (FK)   |
| name          | VARCHAR(255) | Nome do cliente             |
| salary        | DECIMAL      | Salário (>=0)               |
| company_value | DECIMAL      | Valor da empresa (>=0)      |
| status        | ENUM         | active/inactive/blocked/deleted |
| created_at    | BIGINT       | Data de criação (timestamp) |
| updated_at    | BIGINT       | Data de atualização         |
| deleted_at    | BIGINT       | Data de exclusão            |

### Funcionalidades do Banco
- Geração automática de UUIDv7
- Timestamps automáticos em milissegundos
- Triggers para atualização automática de updated_at
- Índices otimizados para busca
- Constraints de integridade referencial
- Enums para status e roles

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo
- [TypeORM](https://typeorm.io/) - ORM para TypeScript e JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Vitest](https://vitest.dev/) - Framework de testes unitários
- [Swagger](https://swagger.io/) - Documentação da API
- [JWT](https://jwt.io/) - Autenticação e autorização
- [Helmet](https://helmetjs.github.io/) - Segurança HTTP
- [Compression](https://github.com/expressjs/compression) - Compressão de resposta

## ⚙️ Configurações da Aplicação

O servidor NestJS é configurado com:

- Timezone: America/Sao_Paulo
- CORS habilitado
- Compressão de resposta
- Headers de segurança via Helmet
- Validação global de DTOs
- Documentação Swagger automática
- Shutdown hooks para graceful shutdown

### Swagger UI
- Disponível em: `/v1/docs`
- Arquivo OpenAPI: `/docs/swagger.json`
- Autenticação via Bearer Token

## API Endpoints

### Rotas da API

| Método | Rota | Descrição | Autenticação | Retorno |
|--------|------|-----------|--------------|---------|
| POST | `/v1/auth/login` | Autentica usuário | Não | Token JWT + Info usuário |
| POST | `/v1/auth/register` | Registra novo usuário | Não | 201 Created |
| GET | `/v1/auth/me` | Perfil do usuário | JWT | Dados do usuário |
| GET | `/v1/client` | Lista clientes | JWT | Lista paginada |
| POST | `/v1/client` | Cria cliente | JWT | Cliente criado |
| GET | `/v1/client/:id` | Busca cliente | JWT | Dados do cliente |
| PUT | `/v1/client/:id` | Atualiza cliente | JWT | Cliente atualizado |
| DELETE | `/v1/client/:id` | Remove cliente | JWT | 204 No Content |

## 🚨 Códigos de Erro

### Erros de Autenticação (6xxx)

| Código | Identificador | HTTP Status | Descrição |
|--------|--------------|-------------|-----------|
| 6000 | AUTH_INVALID_CREDENTIALS | 401 | Credenciais inválidas |
| 6001 | AUTH_REGISTRATION_FAILED | 500 | Falha no registro |
| 6002 | AUTH_PASSWORD_HASH_FAILED | 500 | Falha na criptografia da senha |
| 6003 | AUTH_TOKEN_EXPIRED | 401 | Token JWT expirado |
| 6004 | AUTH_TOKEN_INVALID | 401 | Token JWT inválido |
| 6003 | USER_INACTIVE | 403 | Conta de usuário inativa |

### Erros de Cliente (3xxx)

| Código | Identificador | HTTP Status | Descrição |
|--------|--------------|-------------|-----------|
| 3000 | CLIENT_INVALID_INPUT | 412 | Dados de entrada inválidos |
| 3002 | CLIENT_DUPLICATE_NAME | 409 | Nome já em uso |
| 3003 | CLIENT_INVALID_SALARY | 412 | Salário inválido |
| 3004 | CLIENT_INVALID_COMPANY_VALUE | 412 | Valor da empresa inválido |
| 3005 | CLIENT_NOT_FOUND | 404 | Cliente não encontrado |

### Erros de Usuário (1xxx)

| Código | Identificador | HTTP Status | Descrição |
|--------|--------------|-------------|-----------|
| 1000 | USER_EMAIL_ALREADY_EXISTS | 409 | Email já cadastrado |
| 1001 | USER_USERNAME_ALREADY_EXISTS | 409 | Username já em uso |
| 1002 | USER_NOT_FOUND | 404 | Usuário não encontrado |
| 1003 | USER_ALREADY_VERIFIED | 409 | Usuário já verificado |
| 1004 | USER_NOT_VERIFIED | 403 | Usuário não verificado |

### Erros Internos (5xxx)

| Código | Identificador | HTTP Status | Descrição |
|--------|--------------|-------------|-----------|
| 5000 | INTERNAL_DATABASE_ERROR | 500 | Erro no banco de dados |
| 5001 | INTERNAL_VALIDATION_ERROR | 412 | Falha na validação de dados |
| 5002 | INTERNAL_FORBIDDEN_ERROR | 403 | Acesso negado |

### Formato de Resposta de Erro

```json
{
  "success": false,
  "error": {
    "id": "4920d8a1-f099-4cd8-b707-11f197f2b76c",
    "status": 404,
    "name": "NotFoundError",
    "details": {
      "timestamp": "2025-03-12T23:40:21.864Z",
      "path": "/v1/client/123",
      "code": 3005,
      "description": "Cliente não encontrado"
    }
  }
}
```

## 🧪 Testes

O projeto utiliza Vitest para testes unitários e de integração:

```bash
# Executa todos os testes
npm run test

# Executa testes com coverage
npm run test:cov

# Executa testes em modo watch
npm test -- --watch
```

## 🛠️ Setup do Projeto

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
cp .env.db.example .env.db
```

4. Execute o script de criação do banco:
```bash
psql -U seu_usuario -d seu_banco -f database/schema.sql

# Ou use o comando de seed que já inclui o schema e dados iniciais:
npm run db:seed
```

### Dados Iniciais

O comando `npm run db:seed` cria:

#### Usuários
| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@teddy.com | Admin@123 |
| User | user@teddy.com | User@123 |

#### Clientes
| Nome | Salário | Valor da Empresa |
|------|---------|------------------|
| Empresa ABC | R$ 5.000,00 | R$ 1.000.000,00 |
| Startup XYZ | R$ 8.000,00 | R$ 2.000.000,00 |
| Consultoria 123 | R$ 12.000,00 | R$ 3.000.000,00 |

⚠️ **Nota**: O seed recria as tabelas e dados cada vez que é executado. Use com cautela em ambiente de produção.

5. Inicie o servidor:
```bash
npm run start:dev
```

## 🔐 Variáveis de Ambiente

### Aplicação (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| NODE_ENV | Ambiente da aplicação | development |
| JWT_SECRET | Chave secreta para JWT | X4ZzLMF57XxB |
| JWT_ISSUER | Emissor do JWT | https://teddydigital.io |
| JWT_AUDIENCE | Público-alvo do JWT | teddydigital.io |
| JWT_EXPIRES_IN | Tempo de expiração do token | 1d |
| PASSWORD_HASH_PEPPER | Pepper para hash de senha | IX2aaQqd97PD |
| DB_HOST | Host do banco de dados | localhost |

### Banco de Dados (.env.db)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| POSTGRES_USER | Usuário do PostgreSQL | user |
| POSTGRES_PASSWORD | Senha do PostgreSQL | password |
| POSTGRES_DB | Nome do banco de dados | teddy |
| POSTGRES_HOST_AUTH_METHOD | Método de autenticação | trust |

### Exemplo de .env
```env
NODE_ENV=development

JWT_SECRET=seu_jwt_secret
JWT_ISSUER=https://seudominio.com
JWT_AUDIENCE=seudominio.com
JWT_EXPIRES_IN=1d

PASSWORD_HASH_PEPPER=seu_pepper_secreto

DB_HOST=localhost
```

### Exemplo de .env.db
```env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=nome_do_banco
POSTGRES_HOST_AUTH_METHOD=trust
```

⚠️ **Importante**: Nunca commit arquivos .env com credenciais reais no repositório. Mantenha apenas os arquivos de exemplo (.env.example e .env.db.example) com valores fictícios.