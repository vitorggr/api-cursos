# API Cursos

Este repositório contém uma API RESTful desenvolvida em Node.js (Express) e integrações com banco de dados MySQL, pronta para ser utilizada com um frontend (exemplo: Next.js). O banco de dados pode ser facilmente configurado em nuvem, como no Clever Cloud.

## Principais Funcionalidades

- **Autenticação JWT**: Login seguro, geração e validação de tokens para rotas protegidas.
- **Cadastro de Usuários**: Criação de contas com validação de dados e criptografia de senha.
- **Gestão de Cursos**: Listagem, criação e visualização de cursos, com suporte a filtro por nome/descrição.
- **Inscrição em Cursos**: Usuários podem se inscrever e cancelar inscrição em cursos.
- **Listagem de Inscrições**: Visualização dos cursos em que o usuário está inscrito.
- **Swagger**: Documentação interativa disponível em `/api-docs` durante o desenvolvimento.
- **Seed automático**: Ao iniciar, cursos de exemplo são inseridos automaticamente no banco, caso não existam.
- **CORS configurado**: Permite integração segura com frontends modernos (ex: Vite, Next.js).

## Estrutura de Pastas

- `controllers/` — Lógica das rotas e validação de dados
- `models/` — Definição dos modelos Sequelize (ORM)
- `routes/` — Definição das rotas REST
- `services/` — Lógica de negócio e integração com o banco
- `middlewares/` — Middlewares de autenticação e utilidades
- `config/` — Configurações de banco, Swagger e migração

## Banco de Dados

- Utiliza MySQL, podendo ser configurado localmente ou em nuvem (ex: Clever Cloud)

## Como rodar

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure o banco de dados em `.env` (exemplo disponível no projeto)

3. Inicie a API:
   ```sh
   npm start
   ```
4. Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Observações

- O backend está pronto para integração com frontends modernos (Next.js, React, etc.)
- As rotas e tratamento de dados seguem padrão REST e são compatíveis com autenticação JWT.
- O seed de cursos garante que sempre haverá dados para testes.

---

Desenvolvido para fins didáticos e de demonstração.
