# TechFix – система за управление на компютърни ремонти

ReactJS изпитен проект за SoftUni. **Етап 1: работещ frontend прототип.**

## Изисквания
- Node.js 20.19+ или 22.12+ (препоръчително актуална LTS версия)
- npm

## Инсталиране и стартиране
```bash
npm install
npm run dev
```
Отворете адреса, показан от Vite (обикновено `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```

## Маршрути
- `/` – начална страница
- `/repairs` – каталог
- `/repairs/:repairId` – детайли
- `/repairs/create` – нова заявка
- `/repairs/:repairId/edit` – редактиране
- `/my-repairs` – моите заявки
- `/users/:userId` – потребителски профил
- `/login` – вход
- `/register` – регистрация

## Архитектура
`src/components` – общи UI компоненти; `src/pages` – маршрутизирани екрани; `src/data` – временни демонстрационни записи; `src/styles` – външен CSS; `src/App.jsx` – маршрути.

## Ограничения на Етап 1
- Данните са демонстрационни, локални и не се записват.
- Формулярите не изпращат заявки към сървър.
- Няма реална автентикация, route guards, CRUD, коментари или Supabase.
- **Тази версия не покрива изискванията за финално предаване.**

## Планиран Етап 2
Supabase Auth + PostgreSQL + Row Level Security; реален CRUD; защитени маршрути; коментари; loading/error състояния; deployment; попълнен Functional Guide в README.

## Git процес
Изпитът изисква минимум 5 смислени commit-а, разпределени в поне 3 различни дни. Правете реални commit-и при завършване на отделните етапи.
