# Sistema Base para Igreja

Stack: Node.js (Express), Handlebars, Sequelize, MySQL2 — arquitetura MVC, mobile-first.

## Pré-requisitos
- Node.js 18+
- (Opcional nesta etapa) MySQL rodando no XAMPP

## Setup
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo `.env` baseado em `.env.example` e ajuste os valores desejados.
3. Inicie o servidor (desenvolvimento):
   ```bash
   npm run dev
   ```
   Ou produção:
   ```bash
   npm start
   ```

## Estrutura
```
src/
  app.js              # Configuração do Express e Handlebars
  server.js           # Inicialização do servidor
  config/database.js  # Configuração do Sequelize (sem modelos ainda)
  controllers/        # Controllers
  routes/             # Rotas
  views/              # Views Handlebars (layouts e páginas)
public/
  css/styles.css      # CSS básico
  img/                # Imagens (já existente)
```

## Próximos Passos
- Adicionar modelos Sequelize (membros, agenda, eventos, etc.)
- Criar rotas e páginas adicionais (Sobre, Contato, Ministérios)
- Integrar com banco de dados e autenticação conforme necessidade