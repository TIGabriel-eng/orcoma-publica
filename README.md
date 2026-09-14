<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Orcoma Pública — Frontend + API

Site público da Orcoma com blog, formulário de contato e painel administrativo.

- **Frontend:** React + Vite + Tailwind
- **Backend:** Express (Node)
- **Banco:** PostgreSQL no **Supabase** (schema `publica`, isolado do Orcoma Site)
- **Imagens/uploads:** **Supabase Storage** (bucket `orcoma-publica`)
- **Deploy:** Vercel (frontend estático + API como serverless function)

## Setup inicial (uma vez)

1. **Variáveis de ambiente** (copie `.env.example` para `.env`) e instale as
   dependências:
   ```env
   DATABASE_URL="postgresql://postgres.jytqxtsomfdrbhxjtvpz:SUA_SENHA@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
   SUPABASE_URL="https://jytqxtsomfdrbhxjtvpz.supabase.co"
   SUPABASE_SERVICE_KEY="COLE_A_SERVICE_ROLE_KEY"
   SUPABASE_STORAGE_BUCKET="orcoma-publica"
   JWT_SECRET="uma-string-longa-e-aleatoria"
   ```
   - `SUPABASE_SERVICE_KEY`: painel → **Project Settings → API → service_role**
     (secreta — nunca no frontend).

2. **Criar schema/tabelas no Postgres e o bucket de imagens** — automático e
   idempotente, pode rodar de novo sem quebrar nada:
   ```bash
   npm install
   npm run setup
   ```
   O comando executa o mesmo SQL de
   [`server/scripts/setup-supabase.sql`](server/scripts/setup-supabase.sql)
   (schema `publica` com as tabelas `users`/`posts`/`forms` — isolado do
   Orcoma Site) e cria o bucket **público** `orcoma-publica` no Storage.
   Alternativa manual: [Supabase Dashboard](https://supabase.com/dashboard) →
   **SQL Editor** (rodar o arquivo acima) e **Storage → New bucket** → nome
   `orcoma-publica`, marcando **Public bucket**.

3. **Migrar os dados atuais** (JSON antigo + imagens `server/uploads`) para o
   Supabase:
   ```bash
   npm run migrate
   ```

4. **Conferir** (opcional) — contagens no banco, objetos no bucket e a
   disponibilidade pública de uma imagem:
   ```bash
   npm run verify
   ```

## Rodar localmente

Dois terminais:

```bash
# Terminal 1 — API Express na porta 4000
npm run server

# Terminal 2 — Frontend Vite na porta 3000 (proxy /api -> 4000)
npm run dev
```

Acesse `http://localhost:3000/gctk9eo956szchibkbei`.

### Criar/atualizar usuários (senha gravada com bcrypt)

```bash
npm run seed -- <email> <senha> [nome] [role]
npm run seed -- admin@orcoma.com.br "MinhaSenha@123" "Equipe Admin" superadmin
```

### Credenciais iniciais (apenas demonstração — troque!)

```
E-mail: tiorcomamaracas@orcoma.com.br
Senha:  [defina via npm run seed]
```

## Deploy na Vercel

1. `vercel.json` já está configurado: build do Vite (`dist`) + função
   serverless `api/index.js` (Express).
2. No painel da Vercel, configure as **Environment Variables** (mesmas do `.env`).
3. Deploy. Rotas:
   - `/api/*` → função Express
   - `/*` → SPA (React)

> O painel fica em `/gctk9eo956szchibkbei` e é protegido por JWT + bcrypt.

## Arquitetura de segurança

| Camada | Arquivo | O que faz |
| ------ | ------- | --------- |
| Login | `server/routes/auth.js` | `POST /api/auth/login` compara bcrypt e emite JWT com expiração de 8h |
| Middleware backend | `server/middleware/auth.js` | exige `Authorization: Bearer <JWT>` em **todas** as rotas `/api/gctk9eo956szchibkbei/*` → `401` se ausente/inválido/expirado |
| Dados | `server/db.js` | apenas queries ao schema `publica` do Postgres (Supabase), isolado do Orcoma Site |
| Uploads | `server/storage.js` | envia/remove imagens no bucket `orcoma-publica` (URLs públicas) |
| Contexto React | `src/auth/AuthContext.tsx` | guarda o token em memória (+ `sessionStorage`, sem `localStorage`) e valida a sessão no `load` |
| Guarda de rota | `src/auth/ProtectedRoute.tsx` | sem token válido redireciona qualquer rota do painel para a tela de login |
| Tela de login | `src/admin/AdminLogin.tsx` | formulário e-mail/senha; volta para a URL original após logar |
| Sair | `src/admin/AdminLayout.tsx` | botão "Sair" limpa o token e volta ao login |

Rotas do painel: `/gctk9eo956szchibkbei`, `/gctk9eo956szchibkbei/blog`,
`/gctk9eo956szchibkbei/usuarios`,
`/gctk9eo956szchibkbei/formularios` e `/gctk9eo956szchibkbei/login`.

## Scripts úteis

```bash
npm run lint      # typecheck (tsc --noEmit)
npm run build     # build do frontend (dist/)
npm run server    # API local (Express na porta 4000)
npm run setup     # cria schema/tabelas + bucket público no Supabase (idempotente)
npm run migrate   # migração única JSON -> Supabase
npm run verify    # valida banco + storage + URL pública
npm run seed      # cria/atualiza usuário do painel
```

## Testando a API

```bash
# Sem token (deve retornar 401)
curl -i http://localhost:4000/api/gctk9eo956szchibkbei/stats

# Login (retorna o JWT)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tiorcomamaracas@orcoma.com.br","password":"SUA_SENHA"}'

# Com token (deve retornar 200)
curl -i http://localhost:4000/api/gctk9eo956szchibkbei/stats \
  -H "Authorization: Bearer <COLE_O_TOKEN_AQUI>"
```