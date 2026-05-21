# OlimpAPP

Plataforma gratuita de preparação para olimpíadas científicas voltada a estudantes de escolas públicas brasileiras. O app cobre OBMEP, OBA e outras olimpíadas com trilhas de estudo, vídeo-aulas, atividades e ranking.

---

## Índice

1. [Visão geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Pré-requisitos](#pré-requisitos)
4. [Configuração inicial](#configuração-inicial)
5. [Rodando o projeto](#rodando-o-projeto)
6. [Estrutura de pastas](#estrutura-de-pastas)
7. [Como o app funciona](#como-o-app-funciona)
8. [Rotas da API](#rotas-da-api)
9. [Banco de dados](#banco-de-dados)
10. [Fluxo de autenticação](#fluxo-de-autenticação)
11. [Como adicionar conteúdo](#como-adicionar-conteúdo)
12. [Dicas para contribuir](#dicas-para-contribuir)

---

## Visão geral

O projeto é dividido em duas partes independentes:

| Pasta | O que é | Porta |
|---|---|---|
| `frontend/` | App React (Vite) | 5173 |
| `backend/` | API REST Express + TypeScript | 3333 |

O frontend simula um celular na tela (device frame de 390×812px) e se adapta a qualquer tamanho de monitor. Em mobile real, ocupa a tela inteira.

---

## Tecnologias

**Frontend**
- React 18 + Vite 6
- JavaScript puro (sem TypeScript)
- CSS com variáveis customizadas (sem framework de UI)
- Axios para chamadas à API

**Backend**
- Node.js + Express 5
- TypeScript
- PostgreSQL (sem ORM — SQL puro com `pg`)
- JWT para autenticação
- bcryptjs para hash de senhas

---

## Pré-requisitos

Antes de começar, instale:

- [Node.js 18+](https://nodejs.org/) — cheque com `node -v`
- [PostgreSQL 14+](https://www.postgresql.org/download/) — cheque com `psql --version`
- [pnpm](https://pnpm.io/installation) (recomendado) ou npm — cheque com `pnpm -v`

---

## Configuração inicial

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd olimpapp
```

### 2. Crie o banco de dados

Abra o terminal do PostgreSQL e rode:

```sql
CREATE DATABASE olimpapp_dev;
```

### 3. Configure o backend

```bash
cd backend
pnpm install
```

Crie o arquivo `.env` dentro de `backend/` com o seguinte conteúdo (ajuste usuário e senha do seu PostgreSQL):

```env
PORT=3333
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/olimpapp_dev
JWT_SECRET=troque_por_uma_chave_secreta_qualquer
```

Rode as migrations para criar as tabelas:

```bash
pnpm migrate
```

> Isso cria as tabelas `users`, `profiles`, `olimpiadas_interesse` e `user_progress` no banco.

### 4. Configure o frontend

```bash
cd ../frontend
pnpm install
```

Não precisa de `.env` no frontend — o endereço da API já está em `src/services/api.js`.

---

## Rodando o projeto

Você precisa de **dois terminais abertos ao mesmo tempo**.

**Terminal 1 — Backend:**
```bash
cd backend
pnpm dev
```
Saída esperada: `OlimpAPP backend rodando na porta 3333`

**Terminal 2 — Frontend:**
```bash
cd frontend
pnpm dev
```
Saída esperada: `Local: http://localhost:5173/`

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## Estrutura de pastas

```
olimpapp/
├── frontend/
│   ├── public/
│   │   └── image.png          # Logo do app
│   └── src/
│       ├── components/        # Componentes reutilizáveis
│       │   ├── BottomNav.jsx  # Barra de navegação inferior
│       │   ├── ModuleCard.jsx # Card de módulo nas trilhas
│       │   ├── OlympiadCard.jsx
│       │   └── ProgressBar.jsx
│       ├── data/
│       │   └── trilhasMock.js # Dados locais dos módulos e aulas (mock)
│       ├── screens/           # Uma tela = um arquivo
│       │   ├── LoginScreen.jsx
│       │   ├── DashboardScreen.jsx
│       │   ├── TrilhasScreen.jsx
│       │   ├── ModuloScreen.jsx
│       │   ├── AulaVideoScreen.jsx
│       │   ├── AulaScreen.jsx       # Atividades/questões
│       │   ├── RankingScreen.jsx
│       │   ├── PerfilScreen.jsx
│       │   ├── ConquistasScreen.jsx
│       │   ├── ConfiguracoesScreen.jsx
│       │   ├── ForumScreen.jsx
│       │   └── ForumPostScreen.jsx
│       ├── services/          # Comunicação com a API
│       │   ├── api.js         # Instância do axios com interceptor de token
│       │   ├── authService.js # login, register, logout, isAuthenticated
│       │   ├── userService.js # getMe
│       │   └── ...
│       ├── App.jsx            # Gerencia navegação entre telas
│       ├── App.css            # Todo o CSS do app
│       └── main.jsx
│
└── backend/
    └── src/
        ├── config/
        │   ├── database.ts    # Pool de conexão com o PostgreSQL
        │   ├── migrations.ts  # Cria as tabelas (rode com pnpm migrate)
        │   └── trilhasData.ts # Dados estáticos das trilhas
        ├── controllers/       # Lógica de cada rota
        │   ├── authController.ts
        │   ├── profileController.ts
        │   ├── trilhasController.ts
        │   ├── progressoController.ts
        │   └── rankingController.ts
        ├── middlewares/
        │   └── authMiddleware.ts  # Verifica JWT em rotas protegidas
        ├── routes/            # Define as URLs de cada controller
        │   ├── auth.ts
        │   ├── profile.ts
        │   ├── trilhas.ts
        │   ├── progresso.ts
        │   └── ranking.ts
        └── server.ts          # Ponto de entrada do backend
```

---

## Como o app funciona

### Navegação entre telas

O `App.jsx` é o centro de controle. Ele mantém em estado:
- `currentScreen` — qual tela está ativa no momento
- `profile` — dados do usuário logado
- `currentModule` — módulo selecionado (passado para ModuloScreen)
- `currentAula` — aula selecionada (passado para AulaVideoScreen)

Para navegar, qualquer tela recebe a função `onNavigate`:

```jsx
// Ir para uma tela simples
onNavigate('screen-dashboard')

// Ir para uma tela passando dados
onNavigate('screen-modulo', { module: modObj })
onNavigate('screen-aula-video', { aula: aulaObj })
```

Para voltar, use `onBack`:

```jsx
onBack()               // volta para a tela anterior
onBack('screen-trilhas') // volta para uma tela específica se não houver histórico
```

### Mapa de telas

| ID da tela | Componente | Aba ativa no nav |
|---|---|---|
| `screen-login` | LoginScreen | — |
| `screen-dashboard` | DashboardScreen | home |
| `screen-trilhas` | TrilhasScreen | trilhas |
| `screen-modulo` | ModuloScreen | trilhas |
| `screen-aula-video` | AulaVideoScreen | trilhas |
| `screen-aula` | AulaScreen | trilhas |
| `screen-forum` | ForumScreen | forum |
| `screen-forum-post` | ForumPostScreen | forum |
| `screen-perfil` | PerfilScreen | perfil |
| `screen-ranking` | RankingScreen | perfil |
| `screen-conquistas` | ConquistasScreen | perfil |
| `screen-configuracoes` | ConfiguracoesScreen | perfil |

### CSS e estilização

Todo o CSS fica em `App.css`. As cores, fontes e espaçamentos são definidos como variáveis CSS no topo do arquivo:

```css
:root {
  --blue:      #1A3DAA;
  --yellow:    #F5C518;
  --green:     #22C55E;
  --text:      #12122A;
  --text-dim:  #6B6E85;
  /* ... */
}
```

Convenção de nomes das classes:

| Prefixo | Onde é usado |
|---|---|
| `db-` | Dashboard |
| `tr-` | Trilhas |
| `ml-` | ModuloScreen (module list) |
| `av-` | AulaVideoScreen |
| `au-` | AulaScreen |
| `pf-` | PerfilScreen |
| `rk-` | RankingScreen |
| `cq-` | ConquistasScreen |
| `cfg-` | ConfiguracoesScreen |
| `login-` | LoginScreen |

---

## Rotas da API

Todas as rotas exceto `/auth/*` exigem o header:
```
Authorization: Bearer <token>
```

O axios já envia esse header automaticamente (configurado em `services/api.js`).

### Autenticação

| Método | Rota | Body | Retorno |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password, olimpiadas[] }` | `{ token }` |
| POST | `/auth/login` | `{ email, password }` | `{ token }` |

### Usuário

| Método | Rota | Retorno |
|---|---|---|
| GET | `/me` | Dados do perfil do usuário logado |
| PUT | `/me` | Atualiza nome, escola, cidade, etc. |

### Trilhas

| Método | Rota | Retorno |
|---|---|---|
| GET | `/trilhas` | Lista de trilhas disponíveis |

### Progresso

| Método | Rota | Retorno |
|---|---|---|
| GET | `/progresso` | XP, nível e streak do usuário |

### Ranking

| Método | Rota | Retorno |
|---|---|---|
| GET | `/ranking` | Top 10 usuários por XP |

---

## Banco de dados

### Tabelas

**`users`** — credenciais de acesso
```
id (uuid), email (único), password (hash bcrypt), created_at
```

**`profiles`** — informações do aluno
```
id, user_id (FK), name, school, city, state, grade, xp, streak, created_at
```

**`olimpiadas_interesse`** — olimpíadas que o aluno escolheu
```
id, user_id (FK), olimpiada (texto: 'obmep', 'oba', 'obf', 'obq')
```

**`user_progress`** — progresso nas aulas
```
id, user_id (FK), aula_id, modulo_id, trilha_id, concluida, created_at
```

### Recriar o banco do zero

Se precisar recriar tudo (apaga todos os dados):

```bash
# No psql:
DROP DATABASE olimpapp_dev;
CREATE DATABASE olimpapp_dev;

# No terminal:
cd backend
pnpm migrate
```

---

## Fluxo de autenticação

1. Usuário faz login ou cadastro → backend retorna um **JWT** (token)
2. Frontend salva o token no `localStorage` com a chave `olimpapp_token`
3. Em toda requisição, o `api.js` lê o token e envia no header `Authorization`
4. O `authMiddleware.ts` no backend valida o token antes de processar a rota
5. Se o token expirar (7 dias), a próxima requisição retorna 401 → frontend chama `logout()` e volta para a tela de login

Para testar sem criar conta, use:
- Email: `teste@teste.com`
- Senha: `123456`

---

## Como adicionar conteúdo

### Adicionar aulas a um módulo

Edite `frontend/src/data/trilhasMock.js`. Cada módulo tem um array `aulas`:

```js
{
  id: 'aula-nova',
  title: 'Nome da Aula',
  dur: '12 min',
  watched: false,
  videoId: 'XXXXXXXXXXX', // ID do vídeo no YouTube (parte final da URL)
}
```

O `videoId` é o código que aparece no final da URL do YouTube:
`https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`**

### Adicionar uma nova tela

1. Crie o arquivo em `frontend/src/screens/NomeDaTelaScreen.jsx`
2. Importe no `App.jsx`:
   ```jsx
   import NomeDaTelaScreen from './screens/NomeDaTelaScreen'
   ```
3. Adicione ao objeto `screens` no `App.jsx`:
   ```jsx
   'screen-nome-da-tela': <NomeDaTelaScreen {...screenProps} />,
   ```
4. Se a tela tiver aba ativa no bottom nav, adicione ao `navMap`:
   ```js
   'screen-nome-da-tela': 'trilhas',
   ```

---

## Dicas para contribuir

- **Nunca commite o arquivo `.env`** — ele contém a senha do banco e o segredo do JWT
- **Rode `pnpm migrate` apenas uma vez** — se rodar de novo, as tabelas já existem e o comando ignora (usa `CREATE TABLE IF NOT EXISTS`)
- **Dados das trilhas são mock** — o arquivo `trilhasMock.js` é local. No futuro, esses dados virão da API
- **O CSS é global** — todas as classes ficam em `App.css`. Prefixe sempre com o nome da tela (ex: `db-` para dashboard) para evitar conflitos
- **Sem TypeScript no frontend** — o backend usa TypeScript, o frontend usa JavaScript puro. Não adicione `.ts` ou `tsconfig` na pasta `frontend/`
- **Para testar a API diretamente**, use o [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/). Lembre de incluir o header `Authorization: Bearer <token>` nas rotas protegidas
