# 🧸 Teddy - Sistema de Gerenciamento de Clientes

Sistema completo de gerenciamento de clientes desenvolvido com React (frontend) e NestJS (backend), seguindo as melhores práticas de arquitetura e desenvolvimento.

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