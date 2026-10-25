# TechFix – система за управление на компютърни ремонти

React + Vite приложение със Supabase Auth и PostgreSQL. Реализирани са публичен каталог, заявки за ремонт, регистрация, вход, личен панел, редактиране и изтриване на собствени заявки, както и коментари.

## Стартиране

1. Инсталирайте Node.js и изпълнете `npm install`.
2. Копирайте `.env.example` в `.env.local` и попълнете **собствените** Supabase URL и publishable key.
3. Изпълнете `npm run dev` и отворете показания адрес (обичайно http://localhost:5173).
4. За продукционна компилация: `npm run build`.

## Supabase

Необходима е съществуваща база с таблици `repairs`, `comments` и `profiles` и правилно настроени RLS политики. SQL схемата и политиките **не са включени** в този архив; проверете ги в Supabase Dashboard преди публикуване. Никога не поставяйте `service_role` или secret ключ във Vite клиентска променлива.

## Маршрути

`/` – начална страница; `/repairs` – публичен каталог; `/repairs/:repairId` – детайли и коментари; `/repairs/create` – нова заявка; `/repairs/:repairId/edit` – редактиране; `/my-repairs` – лични заявки; `/profile` и `/users/:userId` – профил; `/login` и `/register` – удостоверяване.

## Известни ограничения

- Полето за модел на устройството все още е сериализирано в `description` с префикс `Устройство:` за съвместимост със съществуващата база. Отделна колона изисква контролирана SQL миграция.
- Защитата на данните зависи от действителните RLS правила и Data API разрешения в Supabase; клиентските проверки не ги заместват.
- Няма включени автоматизирани тестове или миграции. Проведете тестове с два различни потребителя.
- Административните операции за пароли не са част от клиентското приложение.

## Структура

`src/pages` – екрани; `src/components` – интерфейсни компоненти; `src/lib/supabase.js` – Supabase клиент; `src/styles` – CSS.


## Functional Guide (SoftUni exam template)

### 1. Project Overview
**Application:** TechFix. **Category:** Computer repair service requests. Users can publish repair requests, track them, and discuss individual repairs through comments.

### 2. User Access & Permissions
Guests can browse Home, Catalog, and Details (subject to Supabase public-read policies). Authenticated users can create requests, access My Repairs and Profile, and edit or delete only their own requests. Comments are intended for authenticated users; database policies must enforce permissions.

### 3. Authentication & Session Handling
Supabase Auth provides registration, email/password login and logout. AuthProvider initializes the session with getSession, listens to onAuthStateChange and shares user/loading via Context. Supabase SDK persists sessions across reloads. Registration may require email confirmation depending on the Supabase project settings.

### 4. Routing Structure
Public: `/`, `/repairs`, `/repairs/:repairId`. Guest-only: `/login`, `/register`. Private: `/repairs/create`, `/repairs/:repairId/edit`, `/my-repairs`, `/profile`, `/users/:userId`. Unknown URLs display NotFound. PrivateRoute and GuestRoute implement redirects. The dynamic routes include `:repairId` and `:userId`.

### 5. List → Details Flow
Catalog loads repair records from Supabase, supports text search and status filters, and links to `/repairs/:repairId`. Details reads the URL parameter via useParams and fetches the selected record and associated comments.

### 6. Data Source & Backend
Hosted Supabase provides PostgreSQL, authentication and the client SDK. The React application communicates with the remote backend using `@supabase/supabase-js`; no local JSON mock is required for production data. Confirm Row Level Security policies in the deployed database.

### 7. Data Operations (CRUD)
Create: authenticated user submits RepairForm. Read: Catalog, Details and MyRepairs query Supabase. Update: the owner edits a request through RepairForm. Delete: the owner can delete a request. Ownership must also be enforced server-side using Supabase RLS, not merely client-side checks.

### 8. Forms & Validation
AuthPage includes registration/login fields; RepairForm contains title, device, category, description and visibility. Validate non-empty titles, a meaningful description, and matching registration passwords. Form submission uses React event handlers and state. Review server error messages and edge cases in the deployed application.

### 9. React-Specific Techniques
Functional components use useState and useEffect for UI state, remote data loading and lifecycle cleanup. AuthProvider uses createContext/useContext to share identity across routing and header components. The application uses React Router and external CSS in `src/styles/main.css`.

### 10. Typical User Flow
1. Guest opens the Catalog and a repair Details page. 2. Guest registers or logs in. 3. User creates a repair request. 4. User visits My Repairs, edits their own request and can interact with comments.

### 11. Error & Edge Case Handling
Authentication failures appear in AuthPage. Data pages should show loading and API errors and handle missing records; validate these flows with real Supabase credentials. Guest-only/private guards show a session-loading state to avoid incorrect redirects during initialization.

## Deployment and submission checklist
- Run `npm ci` and `npm run build` locally.
- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in hosting environment variables (use publishable key only).
- Confirm Supabase RLS, policies for repairs/comments, and auth redirect URLs.
- Deploy the React build on Vercel or Netlify and verify it loads directly on nested routes.
- **Replace this placeholder with your live frontend URL:** `DEPLOY_URL_TO_ADD`.
- Publish a GitHub repository and confirm at least five meaningful commits over three distinct days; do not fabricate history.
- Verify registration, login, logout, CRUD, comments and ownership with two separate accounts.
