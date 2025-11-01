Sistema de Tarefas (FullStack Node/React)

Aplicação FullStack de um sistema de "To-Do List" (lista de tarefas). O projeto inclui um backend em Node.js (API) e um frontend em React (Vite).

🚀 Tech Stack
Backend:

Node.js v22

TypeScript

Express.js

Prisma (ORM)

SQLite (Base de Dados)

Zod (Validação)

Frontend:

React 18

Vite

TypeScript

Bootstrap

Axios

✨ Funcionalidades
CRUD completo de tarefas (Criar, Ler, Atualizar, Apagar).

Filtros por status (Todas, Pendentes, Concluídas).

Busca por título e descrição.

Persistência de dados local com SQLite.

Interface responsiva e centralizada.

Validação de formulários (frontend e backend).

📋 Pré-requisitos
Node.js (v22 ou superior)

NPM (incluído com o Node.js)

🏃‍♂️ Como Executar (Modo de Desenvolvimento)
Este é o método recomendado para testar a aplicação, pois utiliza os servidores de desenvolvimento com hot-reload e o proxy do Vite já configurado.

É necessário ter dois terminais abertos.

Terminal 1: Backend (API)
Navegue até a pasta do backend:

Bash

cd backend
Instale as dependências:

Bash

npm install
Crie a base de dados (SQLite) e gere o cliente Prisma:

Bash

npx dotenv -e .env -- npx prisma migrate dev --name init
Inicie o servidor de desenvolvimento:

Bash

npm start
O backend estará a rodar em http://localhost:3000.

Terminal 2: Frontend (React App)
Navegue até a pasta do frontend:

Bash

cd frontend
Instale as dependências:

Bash

npm install
Inicie o servidor de desenvolvimento do Vite:

Bash

npm start
O frontend estará a rodar em http://localhost:5173.

🔑 Acesso
Abra o seu navegador e acesse: http://localhost:5173

A aplicação estará 100% funcional. O proxy do Vite (frontend) irá redirecionar automaticamente as chamadas de /api para o backend (http://localhost:3000).

📦 Build (Produção)
Os ficheiros de build podem ser gerados, mas não são recomendados para a avaliação devido à necessidade de configuração de um proxy reverso.

Backend:

Execute npm run build na pasta backend/.

Os ficheiros compilados estarão em backend/dist/.

O script copiará a base de dados dev.db para dist/prisma/ para que o build seja funcional.

Frontend:

Execute npm run build na pasta frontend/.

Os ficheiros estáticos estarão em frontend/dist/.

Nota: Para funcionar, esta pasta deve ser servida por um servidor (nginx, serve, etc.) que faça o proxy reverso de /api para http://localhost:3000.