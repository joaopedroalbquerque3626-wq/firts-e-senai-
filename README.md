# Portal de Competições e Patrocínio

Protótipo acadêmico para cadastrar e apresentar competições, equipes, resultados e oportunidades de patrocínio. O projeto usa React, TypeScript, Vite, Tailwind CSS e Express.

> Este é um projeto independente. Menções e marcas de terceiros pertencem aos respectivos titulares. Nenhum conteúdo demonstrativo deve ser tratado como informação oficial.

## Requisitos

- Node.js 22 ou superior
- npm 10 ou superior

## Instalação

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação fica disponível em `http://localhost:3000` por padrão e já inicia com um cenário demonstrativo preenchido.

Antes de usar o painel, altere `ADMIN_SECRET` no arquivo `.env`. Em produção, a aplicação não inicia sem essa variável.

Para apresentação local do protótipo, a senha padrão é `admin2026`.

## Comandos

```bash
npm run dev        # desenvolvimento
npm run typecheck  # validação TypeScript
npm run build      # build do frontend e do servidor
npm test           # build e testes de integração da API
npm start          # executa o build de produção
```

## Persistência

Os dados são gravados em `DATA_DIR/store.json` com escrita atômica e permissão restrita. Isso atende uma instalação de instância única.

Em hospedagens com disco efêmero, configure `DATA_DIR` para um volume persistente. Para múltiplas instâncias simultâneas, substitua o armazenamento em JSON por um banco transacional compartilhado antes de colocar o sistema em produção.

## Segurança

- Sessão administrativa assinada em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção.
- Todas as rotas administrativas validam a sessão no servidor.
- Limite de tentativas no login e nos formulários públicos.
- Validação de e-mail, URL, tamanho dos campos e consentimento de contato.
- Cabeçalhos de segurança e política de conteúdo restritiva.
- Dados privados não são retornados pela API pública.

## Conteúdo demonstrativo

O painel possui opções para restaurar os dados fictícios ou testar o estado vazio. A restauração exige confirmação e substitui os dados existentes. Senha local: `admin2026`.
