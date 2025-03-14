<div align="center">
    <img src="https://teddydigital.io/wp-content/uploads/2023/10/logo-branco-1536x745.png" alt="Teddy Logo" width="400">
</div>

# Teddy - Sistema de Gerenciamento de Clientes

Sistema completo de gerenciamento de clientes desenvolvido com React (frontend) e NestJS (backend), seguindo as melhores práticas de arquitetura e desenvolvimento.

### Requisitos para Execução

Para executar toda a aplicação, você precisa ter os seguintes softwares instalados na sua máquina:

- **Docker**: Ferramenta de contêinerização que permite criar, implantar e executar aplicações em contêineres.
    - [Docker para Windows](https://docs.docker.com/desktop/install/windows-install/)
    - [Docker para macOS](https://docs.docker.com/desktop/install/mac-install/)
    - [Docker para Linux](https://docs.docker.com/desktop/install/linux-install/)

- **Docker Compose**: Ferramenta para definir e gerenciar multi-contêineres Docker. A partir da versão 2.0, o comando `docker-compose` foi substituído por `docker compose`.
    - [Docker Compose para Windows](https://docs.docker.com/compose/install/)
    - [Docker Compose para macOS](https://docs.docker.com/compose/install/)
    - [Docker Compose para Linux](https://docs.docker.com/compose/install/)

- **Make** (opcional): Ferramenta de automação de build que pode simplificar a execução de múltiplos comandos Docker através de um arquivo `Makefile`.
    - [Make para Windows](http://gnuwin32.sourceforge.net/packages/make.htm)
    - [Make para macOS](https://formulae.brew.sh/formula/make)
    - [Make para Linux](https://www.gnu.org/software/make/)

Certifique-se de que as versões do Docker e Docker Compose são compatíveis com os comandos que você pretende usar:

Antes de executar, certifique-se de criar os arquivos `.env` e `.env.db` na pasta `/backend`. Basta copiar os arquivos de exemplo e renomeá-los:
```bash
cp backend/.env.example backend/.env
cp backend/.env.db.example backend/.env.db
```

- `docker-compose up -d`: Funciona com versões mais antigas do Docker Compose (antes da versão 2.0).
- `docker compose up -d`: Funciona com versões mais recentes do Docker Compose (a partir da versão 2.0).
- `make up`: Funciona se você tiver um arquivo `Makefile` configurado com um alvo `up`.

O frontend ficará disponível em [http://localhost:8000](http://localhost:8000), o backend em [http://localhost:4000](http://localhost:4000) e a documentação do Swagger em [http://localhost:4000/v1/docs](http://localhost:4000/v1/docs).

## 📚 Documentação Detalhada

- [📱 Frontend Documentation](./frontend/README.md) - Documentação completa do frontend
- [⚙️ Backend Documentation](./backend/README.md) - Documentação completa do backend

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Node.js (versão 16 ou superior) - apenas para desenvolvimento local
- npm ou yarn - apenas para desenvolvimento local

### Executando com Docker

1. Clone o repositório:
```bash
git clone https://github.com/gfrancodev/teddy.git
cd teddy
```

2. Configure as variáveis de ambiente:
```bash
# Backend
cp backend/.env.example backend/.env
cp backend/.env.db.example backend/.env.db

# Frontend
cp frontend/.env.example frontend/.env
```

3. Inicie os containers:
```bash
docker-compose up -d
```

A aplicação estará disponível em:
- Frontend: http://localhost:8000
- Backend: http://localhost:4000
- Documentação API: http://localhost:4000/v1/docs

## 📂 Esquema do Banco de Dados

O esquema do banco de dados pode ser encontrado em: `./backend/database/schema.sql`

### Credenciais Iniciais

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@teddy.com | Admin@123 |
| User | user@teddy.com | User@123 |

## 🏗️ Arquitetura

O projeto é dividido em duas partes principais:

### Frontend
- React com Feature Driven Design (FDD)
- TypeScript para tipagem forte
- Vite como build tool
- Tailwind CSS para estilização
- React Hook Form para formulários

### Backend
- NestJS com Onion Architecture
- TypeScript e TypeORM
- PostgreSQL como banco de dados
- JWT para autenticação
- Swagger para documentação da API

## 🐳 Serviços Docker

| Serviço | Descrição | Porta |
|---------|-----------|-------|
| frontend | Interface do usuário em React | 8000 |
| backend | API REST em NestJS | 4000 |
| db | Banco de dados PostgreSQL | 5432 |
| db-migration | Serviço de migração do banco | - |
| db-seed | Serviço de seed de dados iniciais | - |