# 🧸 Teddy Frontend

Sistema de gerenciamento de clientes desenvolvido com React e tecnologias modernas, seguindo a arquitetura Feature Driven Design (FDD) e as melhores práticas de desenvolvimento.

## 🌟 Diferenciais Técnicos

| Tecnologia/Conceito | Descrição | Benefício |
|---------------------|-----------|-----------|
| Feature Driven Design | Arquitetura orientada a features | • Melhor organização do código<br>• Separação clara de responsabilidades<br>• Escalabilidade facilitada<br>• Manutenibilidade aprimorada |
| @brush/localstorage | Biblioteca de gerenciamento de estado local | • Persistência automática<br>• Tipagem forte<br>• Lazy loading<br>• Performance otimizada |
| React Hook Form | Biblioteca de formulários | • Performance otimizada<br>• Validação eficiente<br>• Menos re-renders<br>• Integração com Zod |

## 🏗️ Arquitetura FDD

O projeto segue a arquitetura Feature Driven Design, organizando o código por funcionalidades:

### 📦 Estrutura de Pastas

```
src/
├── app/                    # Páginas e containers
│   ├── client/            # Feature de clientes
│   │   ├── selected/      # Subpáginas
│   │   ├── container.tsx  # Lógica de container
│   │   └── page.tsx       # Componente de página
│   ├── login/
│   └── register/
├── core/                  # Núcleo da aplicação
│   ├── components/        # Componentes compartilhados
│   ├── constants/        # Constantes globais
│   ├── hooks/           # Hooks customizados
│   ├── interfaces/      # Interfaces e tipos
│   ├── providers/       # Provedores de serviços
│   ├── styles/         # Estilos globais
│   └── utils/          # Utilitários
└── features/            # Features da aplicação
    ├── auth/           # Feature de autenticação
    └── client/         # Feature de clientes
        ├── components/ # Componentes específicos
        ├── context/    # Contexto da feature
        └── services/   # Serviços da feature
```

## 🚀 Tecnologias

- [React](https://reactjs.org/) - Biblioteca JavaScript para interfaces
- [@brush/localstorage](https://github.com/brushysuite/brushy-librarys) - Gerenciamento de estado local
- [Vite](https://vitejs.dev/) - Build tool moderna
- [TypeScript](https://www.typescriptlang.org/) - JavaScript com tipagem
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [React Router DOM](https://reactrouter.com/) - Roteamento
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de schemas

## ⚙️ Configurações da Aplicação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/teddy-frontend.git
```

2. Instale as dependências:
```bash
cd teddy-frontend
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

### Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

O projeto estará disponível em `http://localhost:8000`

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| VITE_API_URL | URL da API | http://localhost:3000 |
| VITE_APP_ENV | Ambiente da aplicação | development |
| VITE_PORT | Porta da aplicação | 8000 |

### Exemplo de .env
```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
VITE_PORT=8000
```

## 🌟 Funcionalidades

- ✅ Cadastro de clientes
- 📝 Edição de informações
- 🔍 Busca e filtros
- 📱 Interface responsiva
- 📊 Paginação de dados
- 🎨 Design moderno com Tailwind CSS

## 🐳 Docker

Para executar a aplicação usando Docker:

```bash
# Construir a imagem
docker build -t teddy-frontend .

# Executar o container
docker run -d -p 8000:8000 teddy-frontend
```

A aplicação estará disponível em `http://localhost:8000`